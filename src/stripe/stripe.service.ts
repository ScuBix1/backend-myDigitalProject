import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreateStripeSubscriptionDto } from './dto/create-stripe-subscription.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject(forwardRef(() => SubscriptionsService))
    private subscriptionsService: SubscriptionsService,

    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,

    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,

    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') ?? '');
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
    createCheckoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<string | null> {
    const { customer_id, price_id } = createCheckoutSessionDto;
    const session = await this.stripe.checkout.sessions.create({
      customer: customer_id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('URL_BASE')}/success`,
      cancel_url: `${this.configService.get('URL_BASE')}/cancel`,
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

  async handleWebhook(req: Buffer, signature: string): Promise<Stripe.Event> {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req,
        signature,
        endpointSecret ?? '',
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        if (session.payment_status === 'paid') {
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;

          //TODO: replace with the [const subscriptionId = session.subscription as string;] in prod
          const stripeSubscription = await this.stripe.subscriptions.retrieve(
            subscriptionId,
            {
              expand: ['latest_invoice.payment_intent'],
            },
          );

          const priceId = stripeSubscription.items.data[0].price.id;

          const subscription = await this.subscriptionsRepository.findOne({
            where: { stripe_price_id: priceId },
          });

          if (!subscription) {
            throw new NotFoundException("Aucun abonnement n'a été trouvé");
          }

          const tutor = await this.tutorsRepository.findOne({
            where: { customer_id: customerId },
          });

          if (!tutor) {
            throw new NotFoundException("Aucun tuteur n'a été trouvé");
          }

          await this.subscriptionsService.subscribeTutorToPlan(
            customerId,
            priceId,
            subscriptionId,
          );
        }
      }

      return event;
    } catch {
      throw new BadRequestException(`La vérification a échoué`);
    }
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      },
    );

    return subscription;
  }
}
