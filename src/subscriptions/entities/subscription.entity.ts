import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubscriptionType } from '../../constants/enums/subscriptions.enum';
import { TutorSubscription } from './tutorSubscription.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column()
  stripe_price_id!: string;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.TRY,
  })
  type!: SubscriptionType;

  @OneToMany(() => TutorSubscription, (ts) => ts.subscription, {
    cascade: true,
  })
  tutorSubscriptions?: TutorSubscription[];
}
