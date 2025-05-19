import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tutor } from '../../tutors/entities/tutor.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  manage_tutors!: boolean;

  @Column()
  manage_subscriptions!: boolean;

  @Column()
  manage_games!: boolean;

  @OneToMany(() => Tutor, (tutor) => tutor.id)
  @JoinColumn({ name: 'tutor_id' })
  tutors!: Tutor[];
}
