import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate({ email, password }: LoginDto): Promise<any> {
    const tutor = await this.authService.validateUser({ email, password });
    if (!tutor) {
      throw new UnauthorizedException('Non autorisé');
    }
    return { id: tutor.id, email: tutor.email };
  }
}
