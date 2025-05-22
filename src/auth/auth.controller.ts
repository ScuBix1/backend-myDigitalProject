import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin-login')
  async adminLogin(@Body() body: LoginDto) {
    return this.authService.adminLogin(body.email, body.password);
  }

  @Post('tutor-login')
  async tutorLogin(@Body() body: LoginDto) {
    return this.authService.tutorLogin(body.email, body.password);
  }

  @Post('student-login')
  async studentLogin(@Body() body: LoginStudentDto) {
    return this.authService.studentLogin(body.username, body.password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    return this.authService.sendForgotPasswordEmail(email);
  }

  @Patch('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const { email, password } = resetPasswordDto;

    return this.authService.resetPassword(token, email, password);
  }

  @Post('forgot-admin-password')
  async forgotAdminPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    return this.authService.sendForgotAdminPasswordEmail(email);
  }

  @Patch('reset-admin-password/:token')
  async resetAdminPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const { email, password } = resetPasswordDto;

    return this.authService.resetAdminPassword(token, email, password);
  }
}
