import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentTutor } from 'src/auth/decorators/current-tutor.decorator';
import { NoAccountGuard } from 'src/auth/decorators/no-account-guard.decorator';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Tutor } from './entities/tutor.entity';
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
  async generateEmailVerification(@CurrentTutor() tutor: Tutor) {
    await this.tutorsService.generateEmailVerification(tutor.email);
    return { status: 'succès', message: "Le mail est en cours d'envoie" };
  }

  @Patch('verify')
  async verifyEmail(@Body() data: VerifyEmailDto) {
    const result = await this.tutorsService.verifyEmail(data.otp);
    if (result) {
      return result;
    }
    return { status: 'échec', message: 'échec de la vérification' };
  }

  @Get('/test')
  fetchAllTutors() {
    return this.tutorsService.findOneByEmail('bastian.monnin1@gmail.com');
  }
}
