import {
  Delete,
  Injectable,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { isPresent } from 'src/constants/functions/isPresent';
import { TutorsService } from 'src/tutors/tutors.service';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
    private tutorsService: TutorsService,
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete/tutor/:tutorId')
  async deleteTutor(@Param('tutorId') tutorId: string) {
    return this.tutorsService.deleteTutor(+tutorId);
  }
}
