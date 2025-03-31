import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tutor_subscription')
export class TutorSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tutor, (tutor) => tutor.tutorSubscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @ManyToOne(() => Subscription, (sub) => sub.tutorSubscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ nullable: true })
  stripe_subscription_id: string;

  @Column({ default: false })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;
}
