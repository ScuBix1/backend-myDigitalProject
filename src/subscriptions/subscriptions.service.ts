import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  create(createSubscriptionDto: CreateSubscriptionDto) {
    const { type } = createSubscriptionDto;

    if (
      type !== SubscriptionType.ANNUAL &&
      type !== SubscriptionType.MONTHLY &&
      type !== SubscriptionType.TRY
    ) {
      throw new BadRequestException("Ce type d'abonnement n'existe pas.");
    }
    return createSubscriptionDto;
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
