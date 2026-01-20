import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Admin } from 'src/admins/entities/admin.entity';
import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';
import { MessageService } from 'src/message/message.service';
import { ResponseStudentDto } from 'src/students/dto/response-student.dto';
import { Student } from 'src/students/entities/student.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { VerificationService } from 'src/verification/verification.service';
import { Repository } from 'typeorm';
import { StripeService } from '../stripe/stripe.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { ResponseTutorDto } from './dto/response-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { Tutor } from './entities/tutor.entity';

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,

    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,

    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,

    private verificationTokenService: VerificationService,
    private MessageService: MessageService,
    private stripeService: StripeService,
    private jwtService: JwtService,
    private subscriptionService: SubscriptionsService,
  ) {}

  async findOneByEmail(email: string) {
    const tutor = await this.tutorsRepository.findOneBy({ email });

    if (!tutor) {
      throw new NotFoundException(
        "Le tuteur avec l'email demandé n'est pas trouvé",
      );
    }

    return plainToInstance(ResponseTutorDto, tutor, {
      excludeExtraneousValues: true,
    });
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
        customer_id: null,
        //verification du mail annulé en hébergeant render gratuit (envoie de mail smtp indispo)
        email_verified_at: new Date(),
        account_status: 'actif',
      });

      const savedTutor = await this.tutorsRepository.save(tutor);
      return plainToInstance(ResponseTutorDto, savedTutor, {
        excludeExtraneousValues: true,
      });
    } catch {
      throw new UnauthorizedException('Un tuteur avec cet email existe déjà');
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

    const otp = await this.verificationTokenService.generateOtp(tutor.id ?? 0);

    await this.MessageService.sendEmail({
      subject: 'Math&Magique - Vérification du compte',
      recipients: [
        { name: tutor.firstname + ' ' + tutor.lastname, address: tutor.email },
      ],
      html: `<p>Salut ${tutor.firstname ? tutor.firstname : ' '},</p><p>Voici votre code de vérification: <br /><span style="font-size:24px; font-weight: 700;">${otp}</span></p><p>Cordialement,<br />Math&Magique</p>`,
      text: `Hi${tutor.firstname ? ' ' + tutor.lastname : ''}, Voici votre code de vérification: ${otp}`,
    });
  }

  async verifyEmail(token: string) {
    const invalidMessage = 'OTP invalide ou expiré';

    const tutorId = await this.verificationTokenService.getTutorIdByOtp(token);

    if (!tutorId) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    const tutor = await this.tutorsRepository.findOneBy({ id: tutorId });

    if (!tutor) {
      throw new UnprocessableEntityException("Le tuteur n'existe pas !");
    }

    if (tutor.email_verified_at) {
      throw new UnprocessableEntityException('Compte déjà vérifié');
    }

    const isValid = await this.verificationTokenService.validateOtp(
      tutor.id,
      token,
    );

    if (!isValid) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    const customerId = await this.stripeService.createCustomer(tutor);

    tutor.customer_id = customerId;
    tutor.email_verified_at = new Date();
    tutor.account_status = 'actif';

    await this.tutorsRepository.save(tutor);

    const payload = {
      id: tutor.id,
      username: tutor.email,
      role: 'tutor',
      customer_id: customerId,
    };

    const jwt = this.jwtService.sign(payload);

    return {
      email: tutor.email,
      access_token: jwt,
    };
  }

  async findAllStudentsByTutor(tutorId: number, jwtTutorId: string) {
    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutorId },
    });

    if (!tutor) {
      throw new NotFoundException("Le tuteur spécifié n'existe pas");
    }

    if (tutor.id !== parseInt(jwtTutorId)) {
      throw new NotFoundException("Ce n'est pas votre ID");
    }

    const students = await this.studentsRepository.find({
      where: { tutor: tutor },
    });

    const studentsResponse = students.map((student) => {
      return plainToInstance(ResponseStudentDto, student, {
        excludeExtraneousValues: true,
      });
    });

    return studentsResponse;
  }

  async updateTutor(
    tutorId: number,
    updateTutorDto: UpdateTutorDto,
    jwtTutorId: string,
  ) {
    if (tutorId !== parseInt(jwtTutorId)) {
      throw new UnauthorizedException("Vous n'avez pas le droit de modifier.");
    }

    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutorId },
    });

    if (!tutor) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    if (updateTutorDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateTutorDto.password = await bcrypt.hash(
        updateTutorDto.password,
        salt,
      );
    }

    Object.assign(tutor, updateTutorDto);

    const updatedTutor = await this.tutorsRepository.save(tutor);

    return plainToInstance(ResponseTutorDto, updatedTutor, {
      excludeExtraneousValues: true,
    });
  }

  async findTutorById(tutorId: number) {
    const tutor = await this.tutorsRepository.findOneBy({ id: tutorId });

    if (!tutor) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    return plainToInstance(ResponseTutorDto, tutor, {
      excludeExtraneousValues: true,
    });
  }

  async checkSubscriptionStatus(
    tutorIdFromParam: number,
    tutorIdFromJwt: number,
  ): Promise<{
    subscription_active: boolean;
    type: SubscriptionType | undefined;
  }> {
    if (tutorIdFromParam !== tutorIdFromJwt) {
      throw new UnauthorizedException(
        "Vous ne pouvez accéder qu'à vos données",
      );
    }

    const hasSubscription =
      await this.subscriptionService.hasActiveSubscription(tutorIdFromParam);

    return {
      subscription_active: hasSubscription.is_active,
      type: hasSubscription.type,
    };
  }

  async deleteTutor(tutorId: number) {
    return this.tutorsRepository.delete({ id: tutorId });
  }
}
