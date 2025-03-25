import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
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

  @ApiOperation({ summary: 'Récupère un tuteur en fonction de son email' })
  @Get()
  @ApiQuery({
    name: 'email',
    type: String,
    description: 'Email du tuteur recherché',
    required: true,
  })
  @ApiOkResponse({ description: 'Retourne un tuteur', type: Tutor })
  @ApiNotFoundResponse({
    description: "Le tuteur avec l'email demandé n'est pas trouvé",
  })
  @ApiBadRequestResponse({ description: "L'email du tuteur est invalide" })
  findOne(@Body('email') email: string) {
    return this.tutorsService.findOneByEmail(email);
  }

  @NoAccountGuard()
  @Post('verification-otp')
  async generateEmailVerification(@CurrentTutor() tutor: Tutor) {
    await this.tutorsService.generateEmailVerification(tutor.email);
    return { status: 'succès', message: "Le mail est en cours d'envoie" };
  }

  @Post('verify/:otp')
  async verifyEmail(@Param('otp') otp: string, @Body() data: VerifyEmailDto) {
    const result = await this.tutorsService.verifyEmail(data.email, otp);

    return { status: result ? 'succès' : 'échec', message: null };
  }
}
