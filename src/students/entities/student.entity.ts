import { Grade } from 'src/grades/entities/grade.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  start_hour: Date;

  @Column()
  duration: number;

  @ManyToOne(() => Tutor, (tutor) => tutor.students)
  tutor: Tutor;

  @ManyToOne(() => Grade, (grade) => grade.students)
  grade: Grade;

  @OneToMany(() => Session, (session) => session.id)
  sessions: Session[];
}
