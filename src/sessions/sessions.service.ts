import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  create(createSessionDto: CreateSessionDto) {
    return this.sessionsRepository.save(createSessionDto);
  }

  findAll() {
    return this.sessionsRepository.find();
  }

  findOne(id: number) {
    return this.sessionsRepository.findOne({ where: { id } });
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return this.sessionsRepository.update(id, updateSessionDto);
  }
}
