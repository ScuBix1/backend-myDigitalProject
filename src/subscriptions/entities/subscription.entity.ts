import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
    default: SubscriptionType.INDIVIDUAL,
  })
  type: SubscriptionType;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @ManyToMany(() => Tutor, (tutor) => tutor.subscriptions)
  @JoinColumn({ name: 'tutor_id' })
  tutors: Tutor[];
}
