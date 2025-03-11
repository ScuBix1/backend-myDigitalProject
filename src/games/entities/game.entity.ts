import { Grades } from 'src/constants/enums/grades.enum';
import { Session } from 'src/sessions/entities/session.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column({
    type: 'enum',
    enum: Grades,
    default: Grades.CP,
  })
  grade: Grades;

  @OneToMany(() => Session, (session) => session.id)
  @JoinColumn({ name: 'session_id' })
  sessions: Session[];
}
