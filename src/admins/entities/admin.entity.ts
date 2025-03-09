import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  manage_tutors: boolean;

  @Column()
  manage_subscriptions: boolean;

  @Column()
  manage_games: boolean;

  @OneToMany(() => Tutor, (tutor) => tutor.id)
  tutors: Tutor[];
}
