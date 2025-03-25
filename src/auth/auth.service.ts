import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminsService } from 'src/admins/admins.service';
import { TutorsService } from 'src/tutors/tutors.service';
import { StudentsService } from '../students/students.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private tutorsService: TutorsService,
    private jwtService: JwtService,
    private adminsService: AdminsService,
    private studentsService: StudentsService,
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
}
