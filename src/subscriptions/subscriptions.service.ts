import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';
import { StripeService } from 'src/stripe/stripe.service';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { IsNull, LessThan, Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { TutorSubscription } from './entities/tutorSubscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(TutorSubscription)
    private tutorSubRepo: Repository<TutorSubscription>,
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @Inject(forwardRef(() => StripeService))
    private stripeService: StripeService,
  ) {}

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

  async findOneByTutorId(tutorId: number) {
    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutorId },
    });
    return this.tutorSubRepo.findOne({ where: { tutor: tutor ?? undefined } });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionExpiration() {
    const now = new Date();

    const expired = await this.tutorSubRepo.find({
      where: [
        {
          is_active: true,
          end_date: IsNull(),
        },
        {
          is_active: true,
          end_date: LessThan(now),
        },
      ],
    });

    for (const sub of expired) {
      sub.is_active = false;
      await this.tutorSubRepo.save(sub);
    }
  }

  async subscribeTutorToPlan(
    customerId: string,
    priceId: string,
    stripeSubId: string,
  ) {
    const todayDate = new Date();
    let startDate = todayDate;
    let endDate: Date = new Date();
    const tutor = await this.tutorsRepository.findOneBy({
      customer_id: customerId,
    });
    const subscription = await this.subscriptionsRepository.findOneBy({
      stripe_price_id: priceId,
    });

    if (!tutor || !subscription) throw new NotFoundException();

    if (subscription.type === SubscriptionType.TRY) {
      const previousTrial = await this.tutorSubRepo.findOne({
        where: {
          tutor: { id: tutor.id },
          subscription: { type: SubscriptionType.TRY },
        },
      });

      if (previousTrial) {
        throw new BadRequestException(
          'Le tuteur a déjà bénéficié de l’offre d’essai.',
        );
      }
      endDate = new Date(startDate.getTime() + 15 * 24 * 60 * 60 * 1000);
    }

    const lastActiveSub = await this.tutorSubRepo.findOne({
      where: {
        tutor: { id: tutor.id },
        is_active: true,
      },
      order: { end_date: 'DESC' },
    });

    if (
      lastActiveSub &&
      lastActiveSub.end_date &&
      lastActiveSub.end_date > todayDate
    ) {
      startDate = new Date(lastActiveSub.end_date);
    }

    if (subscription.type === SubscriptionType.MONTHLY) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    }

    if (subscription.type === SubscriptionType.ANNUAL) {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const tutorSubscription = this.tutorSubRepo.create({
      stripe_subscription_id: stripeSubId,
      tutor,
      subscription,
      is_active: true,
      start_date: startDate,
      end_date: endDate,
    });

    await this.tutorSubRepo.save(tutorSubscription);

    return {
      message: 'Abonnement créé',
      stripe_subscription: stripeSubId,
    };
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionsRepository.find({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException("La suscription n'a pas été trouvé.");
    }

    const subscriptionUpdated = { ...subscription, updateSubscriptionDto };

    await this.subscriptionsRepository.save(subscriptionUpdated);

    return { message: 'La modification a été pris en compte.' };
  }

  async remove(id: number) {
    const subscription = await this.subscriptionsRepository.findOneBy({ id });

    if (!subscription) {
      throw new NotFoundException("L'abonnement spécifié n'existe pas");
    }

    await this.subscriptionsRepository.delete(id);

    return {
      message: `L'abonnement a été supprimé avec succès`,
    };
  }

  async hasActiveSubscription(tutorId: number): Promise<boolean> {
    const activeSub = await this.tutorSubRepo.findOne({
      where: {
        tutor: { id: tutorId },
        is_active: true,
      },
    });

    return !!activeSub;
  }
}
