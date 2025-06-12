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
      relations: ['tutor', 'tutor.tutorSubscriptions'],
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

    const hasSubscription =
      student.tutor &&
      student.tutor.tutorSubscriptions &&
      student.tutor.tutorSubscriptions.length > 0;

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
    };
  }

  async findAllByStudent(studentId: number) {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new BadRequestException("L'étudiant spécifié n'existe pas");
    }

    const sessions = await this.sessionsRepository.find({
      where: { student: { id: studentId } },
      relations: ['game'],
    });

    return sessions.map((session) =>
      plainToInstance(ResponseSessionDto, session),
    );
  }

  async updateHighScore(gameId: number, studentId: number, newScore: number) {
    const session = await this.sessionsRepository.findOne({
      where: { game: { id: gameId }, student: { id: studentId } },
      relations: ['game', 'student'],
    });

    if (!session) {
      throw new BadRequestException('Session non trouvée');
    }

    let updated = false;

    if (newScore > session.score) {
      session.score = newScore;
      updated = true;
    }

    if (updated) {
      await this.sessionsRepository.save(session);
    }

    return plainToInstance(ResponseSessionDto, session);
  }

  async findByStudentAndGame(studentId: number, gameId: number) {
    const session = await this.sessionsRepository.findOne({
      where: {
        student: { id: studentId },
        game: { id: gameId },
      },
      relations: ['game', 'student'],
    });

    if (!session) {
      return null;
    }

    return plainToInstance(ResponseSessionDto, session);
  }

  async hasActiveSession(studentId: number, gameId: number): Promise<boolean> {
    const session = await this.sessionsRepository.findOne({
      where: {
        student: { id: studentId },
        game: { id: gameId },
      },
    });

    return !!session;
  }
}
