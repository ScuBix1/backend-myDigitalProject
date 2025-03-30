import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AdminsService } from 'src/admins/admins.service';
import { MessageService } from 'src/message/message.service';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { TutorsService } from 'src/tutors/tutors.service';
import { Repository } from 'typeorm';
import { StudentsService } from '../students/students.service';
import { VerificationService } from '../verification/verification.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private tutorsService: TutorsService,
    private jwtService: JwtService,
    private adminsService: AdminsService,
    private studentsService: StudentsService,
    private verificationService: VerificationService,
    private MessageService: MessageService,
    private configService: ConfigService,
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const tutor = await this.tutorsService.findOneByEmail(email);
    if (!tutor) {
      return null;
    }

    try {
      const isMatch = await bcrypt.compare(password, tutor.password);
      if (!isMatch) {
        return null;
      }
    } catch (error) {
      return null;
    }

    delete tutor.password;

    return tutor;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async adminLogin(email: string, password: string) {
    const admin = await this.adminsService.findOneByEmail(email);

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const payload = {
        id: admin.id,
        username: admin.email,
        password: admin.password,
      };

      return {
        email: admin.email,
        access_token: this.jwtService.sign(payload),
      };
    }

    throw new BadRequestException("L'email ou le mot de passe est incorrect");
  }

  async tutorLogin(email: string, password: string) {
    const tutor = await this.tutorsService.findOneByEmail(email);

    if (tutor && (await bcrypt.compare(password, tutor.password))) {
      const payload = {
        id: tutor.id,
        username: tutor.email,
        password: tutor.password,
      };

      return {
        email: tutor.email,
        access_token: this.jwtService.sign(payload),
      };
    }

    throw new BadRequestException("L'email ou le mot de passe est incorrect");
  }

  async studentLogin(username: string, password: string) {
    const student = await this.studentsService.findOneByUsername(username);

    if (student && (await bcrypt.compare(password, student.password))) {
      const payload = {
        id: student.id,
        username: student.username,
        password: student.password,
      };

      return {
        email: student.username,
        access_token: this.jwtService.sign(payload),
      };
    }

    throw new BadRequestException("L'email ou le mot de passe est incorrect");
  }

  async sendForgotPasswordEmail(email: string) {
    const tutor = await this.tutorsRepository.findOne({ where: { email } });
    if (!tutor) throw new NotFoundException('Aucun utilisateur trouvé');

    const reset = await this.verificationService.generateResetToken(email);

    const resetLink = `${this.configService.get('URL')}/${reset}`;

    await this.MessageService.sendEmail({
      subject: 'Réinitialisation du mot de passe',
      recipients: [{ address: email, name: tutor.firstname }],
      html: `<p>Voici votre lien : <a href="${resetLink}">${resetLink}</a></p>`,
      text: 'text',
    });

    return { message: 'Email de réinitialisation envoyé.' };
  }

  async resetPassword(token: string, email: string, newPassword: string) {
    const tutor = await this.verificationService.verifyResetToken(token, email);
    if (!tutor) throw new NotFoundException('Utilisateur non trouvé');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    tutor.password = hashedPassword;
    await this.tutorsRepository.save(tutor);

    await this.verificationService.deleteResetToken(token);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
