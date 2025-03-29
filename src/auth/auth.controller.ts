import { Body, Controller, Param, Post } from '@nestjs/common';
import { TutorsService } from 'src/tutors/tutors.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    return this.authService.sendForgotPasswordEmail(email);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const { email, password } = resetPasswordDto;

    return this.authService.resetPassword(token, email, password);
  }
}
