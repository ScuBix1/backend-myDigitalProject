import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { Tutor } from './entities/tutor.entity';

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
  ) {}

  async create(createTutorDto: CreateTutorDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createTutorDto.password, salt);
    const admin = this.tutorsRepository.create({
      ...createTutorDto,
      password: hashedPassword,
    });

    return this.tutorsRepository.save(admin);
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
