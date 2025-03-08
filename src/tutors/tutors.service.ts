import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tutor } from './entities/tutor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
  ) {}

  create(tutor: Tutor) {
    return this.tutorsRepository.save(tutor);
  }

  findAll() {
    return this.tutorsRepository.find();
  }

  findOneByEmail(email: string) {
    return this.tutorsRepository.findOneBy({ email });
  }

  update(id: number, tutorInformations: Partial<Tutor>) {
    return this.tutorsRepository.update(id, tutorInformations);
  }

  remove(id: number) {
    return this.tutorsRepository.delete(id);
  }
}
