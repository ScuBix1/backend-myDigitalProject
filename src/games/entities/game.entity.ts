import { IsInt } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grades } from '../../constants/enums/grades.enum';
import { Session } from '../../sessions/entities/session.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  @IsInt()
  score!: number;

  @Column()
  path!: string;

  @Column({
    type: 'enum',
    enum: Grades,
    default: Grades.PS,
  })
  grade!: Grades;

  @OneToMany(() => Session, (session) => session.id)
  @JoinColumn({ name: 'session_id' })
  sessions!: Session[];
}
