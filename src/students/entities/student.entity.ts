import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grades } from '../../constants/enums/grades.enum';
import { Session } from '../../sessions/entities/session.entity';
import { Tutor } from '../../tutors/entities/tutor.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  lastname!: string;

  @Column()
  firstname!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  username!: string;

  @Column()
  password!: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  start_hour?: Date;

  @Column({ type: 'int', nullable: true })
  duration?: number;

  @ManyToOne(() => Tutor, (tutor) => tutor.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: Tutor;

  @Column({
    type: 'enum',
    enum: Grades,
    default: Grades.PS,
  })
  grade!: Grades;

  @OneToMany(() => Session, (session) => session.student, { cascade: true })
  sessions?: Session[];
}
