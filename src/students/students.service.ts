import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Session } from 'src/sessions/entities/session.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Repository } from 'typeorm';
import { StudentsResponse } from '../constants/interfaces/students-response.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { ResponseStudentDto } from './dto/response-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
    @Inject(forwardRef(() => SubscriptionsService))
    private subscriptionService: SubscriptionsService,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const { tutor_id, username } = createStudentDto;

    const existingStudent = await this.studentsRepository.findOne({
      where: { username: username, tutor: { id: tutor_id } },
    });

    if (existingStudent) {
      throw new BadRequestException(
        "Un étudiant avec ce nom d'utilisateur existe déjà",
      );
    }

    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutor_id },
      relations: ['students', 'tutorSubscriptions'],
    });

    if (!tutor) {
      throw new BadRequestException("Le tuteur spécifié n'existe pas");
    }

    const hasAlreadyUsedFreeSession = tutor.has_used_free_session;
    const hasSubscription =
      await this.subscriptionService.hasActiveSubscription(tutor_id);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createStudentDto.password, salt);
    const student = this.studentsRepository.create({
      ...createStudentDto,
      password: hashedPassword,
      tutor,
    });

    if (
      !hasSubscription &&
      tutor.students?.length &&
      tutor.students.length >= 1 &&
      hasAlreadyUsedFreeSession
    ) {
      throw new ForbiddenException(
        'Vous avez déjà créé un élève avec la version gratuite.',
      );
    }

    if (!hasSubscription && !hasAlreadyUsedFreeSession) {
      tutor.has_used_free_session = true;
      await this.tutorsRepository.save(tutor);
    }

    await this.studentsRepository.save(student);
    const responseSavedStudent = plainToInstance(ResponseStudentDto, student);

    return responseSavedStudent;
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
    const studentsResponse: StudentsResponse[] = [];
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

  async remove(id: number, idTutor: number) {
    const student = await this.studentsRepository.findOne({
      where: { id: id },
      relations: ['tutor'],
    });

    if (!student) {
      throw new NotFoundException("L'étudiant spécifié n'existe pas");
    }
    const tutor = await this.tutorsRepository.findOne({
      where: { id: idTutor },
    });

    if (!tutor) {
      throw new NotFoundException("Le tuteur spécifié n'existe pas");
    }

    if (student.tutor.id !== tutor.id) {
      throw new UnauthorizedException("Ce n'est pas votre étudiant");
    }

    await this.studentsRepository.delete(id);
    return `Votre élève ${student.firstname} ${student.lastname} a été supprimé`;
  }

  async updateAvatar(
    studentId: number,
    avatar: string,
  ): Promise<ResponseStudentDto> {
    const student = await this.studentsRepository.findOneBy({ id: studentId });

    if (!student) throw new NotFoundException('Étudiant non trouvé');

    student.avatar = avatar;
    const studentSaved = await this.studentsRepository.save(student);
    return plainToInstance(ResponseStudentDto, studentSaved, {
      excludeExtraneousValues: true,
    });
  }

  async getProgressions(studentId: number) {
    const sessions = await this.sessionsRepository.find({
      where: { student: { id: studentId } },
      relations: ['game'],
    });

    const progressions = sessions.map((session) => {
      const maxScore = session.game.score || 1;
      const percent = (session.score / maxScore) * 100;

      return {
        gameId: session.game.id,
        gameName: session.game.name,
        score: session.score,
        maxScore: session.game.score,
        percent: Math.round(percent),
      };
    });

    return progressions;
  }
}
