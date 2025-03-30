import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { CreateStripeSubscriptionDto } from './dto/create-stripe-subscription.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  @InjectRepository(Tutor)
  private tutorsRepository: Repository<Tutor>;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
  }

  async createCustomer(tutor: Tutor): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: tutor.email,
      name: `${tutor.firstname} ${tutor.lastname}`,
    });

    tutor.customer_id = customer.id;
    await this.tutorsRepository.save(tutor);

    return customer.id;
  }

  async createSubscription(
    createStripeSubscriptionDto: CreateStripeSubscriptionDto,
  ) {
    const { customer_id, price_id } = createStripeSubscriptionDto;

    const subscription = await this.stripe.subscriptions.create({
      customer: customer_id,
      items: [{ price: price_id }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
  ): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    return session.url;
  }

  async getSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async verifyPriceIdExists(priceId: string) {
    const price = await this.stripe.prices.retrieve(priceId);

    if (!price) {
      throw new NotFoundException(
        "L'id Stripe donné est inexistant ou invalide",
      );
    }

    return price;
  }
}
