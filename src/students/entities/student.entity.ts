import { Grades } from 'src/constants/enums/grades.enum';
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

  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  start_hour: Date;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @ManyToOne(() => Tutor, (tutor) => tutor.students)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @Column({
    type: 'enum',
    enum: Grades,
    default: Grades.PS,
  })
  grade: Grades;

  @OneToMany(() => Session, (session) => session.id)
  @JoinColumn({ name: 'session_id' })
  sessions: Session[];
}
