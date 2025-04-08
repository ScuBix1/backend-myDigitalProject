import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const { tutor_id } = createStudentDto;

    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutor_id },
    });
    if (!tutor) {
      throw new BadRequestException("Le tuteur spécifié n'existe pas");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createStudentDto.password, salt);
    const student = this.studentsRepository.create({
      ...createStudentDto,
      password: hashedPassword,
      tutor,
    });

    const { id, password, ...rest } = student;
    const { id: idTutor, password: passwordTutor, ...restTutor } = tutor;
    console.log(restTutor);
    await this.studentsRepository.save(student);
    return { ...rest, tutor: idTutor };
  }

  async findOneByUsername(username: string) {
    const student = await this.studentsRepository.findOne({
      where: { username: username },
    });
    if (!student) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return student;
  }

  async findOneByUsernameAndTutor(username: string, tutor_id: number) {
    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutor_id },
    });
    if (!tutor) {
      throw new NotFoundException("Le tuteur spécifié n'existe pas");
    }
    const student = await this.studentsRepository.findOne({
      where: { username: username, tutor: tutor },
    });
    if (!student) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return student;
  }

  findAll() {
    return this.studentsRepository.find();
  }

  remove(id: number) {
    return this.studentsRepository.delete(id);
  }
}
