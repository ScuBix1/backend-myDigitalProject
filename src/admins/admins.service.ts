import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { isPresent } from 'src/constants/functions/isPresent';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const existingAdmin = await this.adminsRepository.findOneBy({});

    if (existingAdmin) {
      throw new UnauthorizedException('Un administrateur existe déjà');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createAdminDto.password, salt);

    const admin = this.adminsRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    return this.adminsRepository.save(admin);
  }

  async findOneByEmail(email: string) {
    const admin = await this.adminsRepository.findOne({
      where: { email },
    });

    if (isPresent(admin)) {
      return admin;
    }

    throw new NotFoundException('Utilisateur non trouvé');
  }

  async update(
    id: number,
    updateAdminDto: Partial<CreateAdminDto>,
  ): Promise<Admin> {
    const admin = await this.adminsRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    Object.assign(admin, updateAdminDto);

    return this.adminsRepository.save(admin);
  }
}
