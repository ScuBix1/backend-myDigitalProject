import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/admins/entities/admin.entity';
import { Repository } from 'typeorm';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { Tutor } from './entities/tutor.entity';

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,

    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
  ) {}

  async create(createTutorDto: CreateTutorDto) {
    const existingAdmin = await this.adminsRepository.findOneBy({});
    if (!existingAdmin) {
      throw new UnauthorizedException(
        'Création impossible, aucun administrateur trouvé',
      );
    }
    console.log(existingAdmin);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createTutorDto.password, salt);
    const admin = this.tutorsRepository.create({
      ...createTutorDto,
      password: hashedPassword,
    });

    return this.tutorsRepository.save(admin);
  }

  async findOneByEmail(email: string) {
    const existingAdmin = await this.adminsRepository.findOneBy({});

    if (!existingAdmin) {
      throw new UnauthorizedException(
        'Création impossible, aucun administrateur trouvé',
      );
    }

    const tutor = await this.tutorsRepository.findOneBy({ email });

    if (!tutor) {
      throw new NotFoundException(
        "Le tuteur avec l'email demandé n'est pas trouvé",
      );
    }

    return { ...tutor, admin_id: existingAdmin.id };
  }
}
