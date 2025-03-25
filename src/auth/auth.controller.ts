import { Body, Controller, Post } from '@nestjs/common';
import { TutorsService } from 'src/tutors/tutors.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tutorsService: TutorsService,
  ) {}

  @Post('admin-login')
  async adminLogin(@Body() body) {
    return this.authService.adminLogin(body.email, body.password);
  }
  @Post('tutor-login')
  async tutorLogin(@Body() body) {
    return this.authService.tutorLogin(body.email, body.password);
  }
  @Post('student-login')
  async studentLogin(@Body() body) {
    return this.authService.studentLogin(body.email, body.password);
  }
}
