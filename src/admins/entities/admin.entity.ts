import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  manageTutors: boolean;

  @Column()
  manageSubscriptions: boolean;

  @Column()
  manageGames: boolean;

  @OneToMany(() => Tutor, (tutor) => tutor.id)
  tutors: Tutor[];
}
