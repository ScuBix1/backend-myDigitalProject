import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { isPresent } from 'src/constants/functions/isPresent';
import { Grade } from 'src/grades/entities/grade.entity';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const { tutor_id, grade_id } = createStudentDto;

    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutor_id },
    });
    if (!tutor) {
      throw new BadRequestException("Le tuteur spécifié n'existe pas");
    }

    const grade = await this.gradesRepository.findOne({
      where: { id: grade_id },
    });
    if (!grade) {
      throw new BadRequestException("Le niveau scolaire spécifié n'existe pas");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createStudentDto.password, salt);
    const admin = this.studentsRepository.create({
      ...createStudentDto,
      password: hashedPassword,
      grade,
      tutor,
    });

    return this.studentsRepository.save(admin);
  }

  async findOneByUsername(username: string) {
    const student = await this.studentsRepository.findOne({
      where: { username },
    });
    if (isPresent(student)) {
      return student;
    }
    throw new NotFoundException('Utilisateur non trouvé');
  }

  findAll() {
    return `This action returns all students`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
