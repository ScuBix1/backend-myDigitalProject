import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Game } from 'src/games/entities/game.entity';
import { Student } from 'src/students/entities/student.entity';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { ResponseSessionDto } from './dto/response-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const game = await this.gamesRepository.findOne({
      where: { id: createSessionDto.game_id },
    });

    if (!game) {
      throw new BadRequestException("Le jeu spécifié n'existe pas");
    }

    const student = await this.studentsRepository.findOne({
      where: { id: createSessionDto.student_id },
      relations: ['tutor'],
    });

    if (!student) {
      throw new BadRequestException("L'étudiant spécifié n'existe pas");
    }

    const existingSession = await this.sessionsRepository.findOne({
      where: {
        game: { id: createSessionDto.game_id },
        student: { id: createSessionDto.student_id },
      },
    });

    if (existingSession) {
      throw new BadRequestException(
        'Une session existe déjà pour cet étudiant et ce jeu',
      );
    }

    const tutor = await this.tutorsRepository.findOne({
      where: { id: student.tutor.id },
      relations: ['tutorSubscriptions'],
    });

    // S'il n'a pas d'abonnement et essaie un autre jeu que le 1 => refus
    console.log(tutor?.tutorSubscriptions);
    const hasSubscription = !!tutor?.tutorSubscriptions;

    if (!hasSubscription && game.id !== 1) {
      throw new ForbiddenException(
        'Vous devez vous abonner pour accéder à ce jeu.',
      );
    }

    const session = this.sessionsRepository.create({
      ...createSessionDto,
      game,
      student,
    });

    await this.sessionsRepository.save(session);

    return {
      session: plainToInstance(ResponseSessionDto, session),
      game: game.id,
      student: student.id,
    };
  }

  findAll() {
    return this.sessionsRepository.find();
  }

  findOne(id: number) {
    return this.sessionsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    await this.sessionsRepository.update(id, updateSessionDto);
    return updateSessionDto;
  }
}
