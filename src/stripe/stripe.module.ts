import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stripe, Tutor])],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
