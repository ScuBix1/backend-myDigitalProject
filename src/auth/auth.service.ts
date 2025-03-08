import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { TutorsService } from 'src/tutors/tutors.service';

@Injectable()
export class AuthService {
  constructor(
    private tutorsService: TutorsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const tutor = await this.tutorsService.findOneByEmail(email);
    if (tutor && (await bcrypt.compare(pass, tutor.password))) {
      const { password, ...result } = tutor;
      return result;
    }
    throw new UnauthorizedException('Utilisateur non autorisé');
  }

  async login(email: string, password: string) {
    const tutor = await this.tutorsService.findOneByEmail(email);
    if (tutor.email === email && password === tutor.password) {
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
}
