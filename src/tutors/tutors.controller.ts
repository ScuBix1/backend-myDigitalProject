import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentTutor } from 'src/auth/decorators/current-tutor.decorator';
import { GetJwtUserId } from 'src/auth/decorators/get-jwt-user-id.decorator';
import { NoAccountGuard } from 'src/auth/decorators/no-account-guard.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtPayload } from 'src/constants/interfaces/jwt-payload.interface';
import { EmailDto } from 'src/message/dto/email.dto';
import { Student } from 'src/students/entities/student.entity';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { TutorsService } from './tutors.service';

@Controller('tutors')
@UseInterceptors(ClassSerializerInterceptor)
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}
  @ApiOperation({ summary: "Inscription d'un tuteur" })
  @ApiBadRequestResponse({
    description: 'Les informations saisies sont invalides',
  })
  @ApiCreatedResponse({
    description: 'Le tuteur a été créé avec succès',
    type: CreateTutorDto,
  })
  @Post('sign-up')
  create(@Body() createTutorDto: CreateTutorDto) {
    return this.tutorsService.create(createTutorDto);
  }

  @NoAccountGuard()
  @Post('verification-otp')
  async generateEmailVerification(@Body() body: EmailDto) {
    await this.tutorsService.generateEmailVerification(body.email);
    return { status: 'succès', message: "Le mail est en cours d'envoi" };
  }

  @Patch('verify')
  async verifyEmail(@Body() data: VerifyEmailDto) {
    const result = await this.tutorsService.verifyEmail(data.otp);
    if (result) {
      return result;
    }
    return { status: 'échec', message: 'échec de la vérification' };
  }

  @ApiOkResponse({
    description: 'Liste des étudiants du tuteur',
    type: Student,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':tutorId/students')
  async getStudentsByTutor(
    @Param('tutorId') tutorId: number,
    @CurrentTutor('id') user: JwtPayload,
  ) {
    return this.tutorsService.findAllStudentsByTutor(tutorId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('tutor')
  @Patch(':id')
  async updateTutor(
    @Param('id') tutorId: string,
    @Body() updateTutorDto: UpdateTutorDto,
    @GetJwtUserId() jwtTutorId: string,
  ) {
    return this.tutorsService.updateTutor(+tutorId, updateTutorDto, jwtTutorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('tutor')
  @Get('me')
  getMyTutorProfile(@GetJwtUserId() tutorId: string) {
    return this.tutorsService.findTutorById(+tutorId);
  }
}
