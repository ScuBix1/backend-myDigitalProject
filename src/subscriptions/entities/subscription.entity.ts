import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TutorSubscription } from './tutorSubscription.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  stripe_price_id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.TRY,
  })
  type: SubscriptionType;

  @OneToMany(() => TutorSubscription, (ts) => ts.subscription)
  tutorSubscriptions: TutorSubscription[];
}
