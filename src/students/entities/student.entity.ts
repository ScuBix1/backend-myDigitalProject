import { Grade } from 'src/grades/entities/grade.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @ManyToOne(() => Grade, (grade) => grade.students)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @OneToMany(() => Session, (session) => session.id)
  @JoinColumn({ name: 'session_id' })
  sessions: Session[];
}
