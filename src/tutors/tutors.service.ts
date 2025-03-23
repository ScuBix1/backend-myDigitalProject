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

  async findOneByEmail(email: string) {
    const tutor = await this.tutorsRepository.findOneBy({ email });

    if (!tutor) {
      throw new NotFoundException(
        "Le tuteur avec l'email demandé n'est pas trouvé",
      );
    }

    return tutor;
  }

  async create(createTutorDto: CreateTutorDto) {
    try {
      const { admin_id } = createTutorDto;
      const existingAdmin = await this.adminsRepository.findOne({
        where: { id: admin_id },
      });

      if (!existingAdmin) {
        throw new UnauthorizedException(
          'Création impossible, aucun administrateur trouvé',
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createTutorDto.password, salt);
      const tutor = this.tutorsRepository.create({
        ...createTutorDto,
        admin: existingAdmin,
        password: hashedPassword,
      });

      const savedTutor = await this.tutorsRepository.save(tutor);

      const { password: tutorPassword, ...tutorWithoutPassword } = savedTutor;

      const { password: adminPassword, ...adminWithoutPassword } =
        savedTutor.admin;

      return { ...tutorWithoutPassword, ...adminWithoutPassword };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new UnauthorizedException('Un tuteur avec cet email existe déjà');
      }
    }
  }
}
