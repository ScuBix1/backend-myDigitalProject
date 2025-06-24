import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { TutorsModule } from 'src/tutors/tutors.module';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Tutor]),
    forwardRef(() => TutorsModule),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService, TypeOrmModule],
})
export class AdminsModule {}
