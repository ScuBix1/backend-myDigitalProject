import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tutor, Subscription]),
    forwardRef(() => SubscriptionsModule),
  ],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
