import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tutor } from '../../tutors/entities/tutor.entity';

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Tutor, (tutor) => tutor.id)
  @JoinColumn({ name: 'tutor_id' })
  tutor!: Tutor;

  @Column()
  token!: string;

  @Column()
  expires_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}
