import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admins/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MessageService } from 'src/message/message.service';
import { StripeService } from 'src/stripe/stripe.service';
import { Student } from 'src/students/entities/student.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { TutorSubscription } from 'src/subscriptions/entities/tutorSubscription.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Verification } from 'src/verification/entities/verification.entity';
import { VerificationService } from 'src/verification/verification.service';
import { Tutor } from './entities/tutor.entity';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tutor,
      Admin,
      Verification,
      TutorSubscription,
      Subscription,
      Student,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [TutorsController],
  providers: [
    TutorsService,
    VerificationService,
    MessageService,
    StripeService,
    SubscriptionsService,
  ],
  exports: [TutorsService],
})
export class TutorsModule {}
