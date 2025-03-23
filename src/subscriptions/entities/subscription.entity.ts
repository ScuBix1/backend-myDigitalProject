import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.TRY,
  })
  type: SubscriptionType;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @ManyToMany(() => Tutor, (tutor) => tutor.subscriptions)
  @JoinTable({
    name: 'tutor_subscription',
    joinColumn: { name: 'subscription_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tutor_id', referencedColumnName: 'id' },
  })
  tutors: Tutor[];
}
