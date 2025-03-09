import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { Tutor } from './entities/tutor.entity';
import { TutorsService } from './tutors.service';

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Post('sign-up')
  create(@Body() createTutorDto: CreateTutorDto) {
    return this.tutorsService.create(createTutorDto);
  }

  @Get()
  findAll() {
    return this.tutorsService.findAll();
  }

  @Get()
  findOne(@Body('email') email: string) {
    return this.tutorsService.findOneByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() tutorInformations: Partial<Tutor>) {
    return this.tutorsService.update(id, tutorInformations);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tutorsService.remove(id);
  }
}
