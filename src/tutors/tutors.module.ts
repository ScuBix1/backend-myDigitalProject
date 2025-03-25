import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admins/entities/admin.entity';
import { EmailService } from 'src/message/email.service';
import { Verification } from 'src/verification/entities/verification.entity';
import { VerificationService } from 'src/verification/verification.service';
import { Tutor } from './entities/tutor.entity';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tutor, Admin, Verification])],
  controllers: [TutorsController],
  providers: [TutorsService, VerificationService, EmailService],
  exports: [TutorsService],
})
export class TutorsModule {}
