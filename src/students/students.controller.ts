import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { IsTutorOfStudentGuard } from 'src/auth/guards/is-tutor-of-student.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('sign-up')
  @ApiOperation({ summary: "Inscription d'un étudiant" })
  @ApiCreatedResponse({
    description: "L'étudiant a été créé avec succès",
    type: CreateStudentDto,
  })
  @ApiBadRequestResponse({
    description: 'Les informations saisies sont invalides',
  })
  @UseGuards(JwtAuthGuard)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @UseGuards(JwtAuthGuard, IsTutorOfStudentGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Body('tutor_id') idTutor: number) {
    return this.studentsService.remove(+id, idTutor);
  }
}
