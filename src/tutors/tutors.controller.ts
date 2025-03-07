import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { Tutor } from './entities/tutor.entity';

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Post()
  create(@Body() tutorInformations: Tutor) {
    return this.tutorsService.create(tutorInformations);
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
