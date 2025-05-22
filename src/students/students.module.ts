import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorSubscription } from 'src/subscriptions/entities/tutorSubscription.entity';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Student } from './entities/student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Tutor, TutorSubscription]),
    forwardRef(() => SubscriptionsModule),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService, TypeOrmModule],
})
export class StudentsModule {}
