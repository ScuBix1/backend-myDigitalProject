import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';
import { StripeService } from 'src/stripe/stripe.service';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  @InjectRepository(Tutor)
  private tutorsRepository: Repository<Tutor>;
  @InjectRepository(Subscription)
  private subscriptionsRepository: Repository<Subscription>;
  constructor(private stripeService: StripeService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { price, stripe_price_id, type } = createSubscriptionDto;

    if (
      type !== SubscriptionType.ANNUAL &&
      type !== SubscriptionType.MONTHLY &&
      type !== SubscriptionType.TRY
    ) {
      throw new BadRequestException(
        "Ce type d'abonnement ne peut pas être créé.",
      );
    }

    const subscriptionSaved = this.subscriptionsRepository.create({
      price,
      stripe_price_id,
      type,
    });

    return this.subscriptionsRepository.save(subscriptionSaved);
  }

  async subscribeTutorToPlan(tutorId: number, subscriptionId: number) {
    const tutor = await this.tutorsRepository.findOneBy({ id: tutorId });
    const subscription = await this.subscriptionsRepository.findOneBy({
      id: subscriptionId,
    });

    if (!tutor || !subscription) throw new NotFoundException();

    const stripeSub = await this.stripeService.createSubscription({
      customer_id: tutor.customer_id,
      price_id: subscription.stripe_price_id,
    });

    return {
      message: 'Abonnement créé',
      stripe_subscription: stripeSub,
    };
  }

  findAll() {
    return `This action returns all subscriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
