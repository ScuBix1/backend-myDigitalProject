import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { TutorsService } from './tutors.service';

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Post('sign-up')
  create(@Body() createTutorDto: CreateTutorDto) {
    return this.tutorsService.create(createTutorDto);
  }

  @Get()
  findOne(@Body('email') email: string) {
    return this.tutorsService.findOneByEmail(email);
  }
}
