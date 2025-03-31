import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from 'src/stripe/stripe.module';
import { StripeService } from 'src/stripe/stripe.service';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Subscription } from './entities/subscription.entity';
import { TutorSubscription } from './entities/tutorSubscription.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, TutorSubscription, Tutor]),
    StripeModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, StripeService],
})
export class SubscriptionsModule {}
