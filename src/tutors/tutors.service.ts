import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/admins/entities/admin.entity';
import { EmailService } from 'src/message/email.service';
import { VerificationService } from 'src/verification/verification.service';
import { Repository } from 'typeorm';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { Tutor } from './entities/tutor.entity';

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,

    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,

    private verificationTokenService: VerificationService,
    private emailService: EmailService,
  ) {}

  async findOneByEmail(email: string) {
    const tutor = await this.tutorsRepository.findOneBy({ email });

    if (!tutor) {
      throw new NotFoundException(
        "Le tuteur avec l'email demandé n'est pas trouvé",
      );
    }

    return tutor;
  }

  async create(createTutorDto: CreateTutorDto) {
    try {
      const { admin_id } = createTutorDto;
      const existingAdmin = await this.adminsRepository.findOne({
        where: { id: admin_id },
      });

      if (!existingAdmin) {
        throw new UnauthorizedException(
          'Création impossible, aucun administrateur trouvé',
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createTutorDto.password, salt);
      const tutor = this.tutorsRepository.create({
        ...createTutorDto,
        admin: existingAdmin,
        password: hashedPassword,
      });

      const savedTutor = await this.tutorsRepository.save(tutor);

      const { password: tutorPassword, ...tutorWithoutPassword } = savedTutor;

      const { password: adminPassword, ...adminWithoutPassword } =
        savedTutor.admin;

      return { ...tutorWithoutPassword, ...adminWithoutPassword };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new UnauthorizedException('Un tuteur avec cet email existe déjà');
      }
    }
  }

  async generateEmailVerification(email: string) {
    const tutor = await this.tutorsRepository.findOneBy({ email });

    if (!tutor) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    if (tutor.email_verified_at) {
      throw new UnprocessableEntityException('Compte déjà vérifié');
    }

    const otp = await this.verificationTokenService.generateOtp(tutor.id);

    await this.emailService.sendEmail({
      subject: 'Math&Magique - Vérification du compte',
      recipients: [
        { name: tutor.firstname + ' ' + tutor.lastname, address: tutor.email },
      ],
      html: `<p>Salut ${tutor.firstname ? tutor.firstname : ' '},</p><p>Voici votre code de vérification: <br /><span style="font-size:24px; font-weight: 700;">${otp}</span></p><p>Cordialement,<br />Math&Magique</p>`,
      text: `Hi${tutor.firstname ? ' ' + tutor.lastname : ''}, Voici votre code de vérification: ${otp}`,
    });
  }

  async verifyEmail(email: string, token: string) {
    const invalidMessage = 'OTP invalide ou expiré';

    const tutor = await this.tutorsRepository.findOneBy({ email });

    if (!tutor) {
      throw new UnprocessableEntityException("Le tuteur n'existe pas !");
    }

    if (tutor.email_verified_at) {
      throw new UnprocessableEntityException('Compte déjà verifié');
    }

    const isValid = await this.verificationTokenService.validateOtp(
      tutor.id,
      token,
    );

    if (!isValid) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    tutor.email_verified_at = new Date();
    tutor.account_status = 'actif';

    await this.tutorsRepository.save(tutor);

    return true;
  }
}
