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
    const { tutor_id, username } = createStudentDto;

    const existingStudent = await this.studentsRepository.findOne({
      where: { username: username },
    });

    if (existingStudent) {
      throw new BadRequestException(
        "Un étudiant avec ce nom d'utilisateur existe déjà",
      );
    }

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
    const { id: idTutor } = tutor;
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

  async findAll() {
    const students = await this.studentsRepository.find({
      relations: ['tutor'],
    });
    const studentsResponse = [];
    students.map((student) => {
      const { lastname, firstname, username, tutor } = student;
      const { id } = tutor;
      studentsResponse.push({
        lastname,
        firstname,
        username,
        tutor: id,
      });
    });
    return studentsResponse;
  }

  async findAllStudentsByTutor(tutor_id: number, jwtTutorId: number) {
    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutor_id },
    });
    if (!tutor) {
      throw new NotFoundException("Le tuteur spécifié n'existe pas");
    }
    if (tutor.id !== jwtTutorId) {
      throw new NotFoundException("Ce n'est pas votre ID");
    }
    const students = await this.studentsRepository.find({
      where: { tutor: tutor },
    });
    const studentsResponse = [];
    students.map((student) => {
      const { id, lastname, firstname, username } = student;
      studentsResponse.push({
        id,
        lastname,
        firstname,
        username,
      });
    });
    return studentsResponse;
  }

  remove(id: number) {
    return this.studentsRepository.delete(id);
  }
}
