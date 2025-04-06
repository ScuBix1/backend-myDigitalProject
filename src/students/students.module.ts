import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Student } from './entities/student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Tutor])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService, TypeOrmModule],
})
export class StudentsModule {}
