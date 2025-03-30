import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admins/entities/admin.entity';
import { MessageService } from 'src/message/message.service';
import { StripeService } from 'src/stripe/stripe.service';
import { TutorSubscription } from 'src/subscriptions/entities/tutorSubscription.entity';
import { Verification } from 'src/verification/entities/verification.entity';
import { VerificationService } from 'src/verification/verification.service';
import { Tutor } from './entities/tutor.entity';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tutor, Admin, Verification, TutorSubscription]),
  ],
  controllers: [TutorsController],
  providers: [
    TutorsService,
    VerificationService,
    MessageService,
    StripeService,
  ],
  exports: [TutorsService],
})
export class TutorsModule {}
