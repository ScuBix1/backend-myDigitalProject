import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetJwtUserId } from 'src/auth/decorators/get-jwt-user-id.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { IsTutorOfStudentGuard } from 'src/auth/guards/is-tutor-of-student.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentAvatarDto } from './dto/update-student-avatar.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    const student = await this.studentsService.findOne(+id);

    return student;
  }

  @Patch(':id/avatar')
  @UseGuards(JwtAuthGuard, RolesGuard, IsTutorOfStudentGuard)
  @Roles('tutor')
  async updateAvatar(
    @Param('id') id: string,
    @Body() dto: UpdateStudentAvatarDto,
  ) {
    return this.studentsService.updateAvatar(+id, dto.avatar);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard, IsTutorOfStudentGuard)
  @Roles('tutor')
  @Get(':id/progressions')
  async getStudentProgressions(@Param('id') id: string) {
    return this.studentsService.getProgressions(+id);
  }

  @UseGuards(JwtAuthGuard, IsTutorOfStudentGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Body('tutor_id') idTutor: number) {
    return this.studentsService.remove(+id, idTutor);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('tutor')
  async updateStudent(
    @Param('id') studentId: string,
    @GetJwtUserId() tutorId: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.updateStudentByTutor(
      +studentId,
      tutorId,
      updateStudentDto,
    );
  }
}
