import { Grades } from 'src/constants/enums/grades.enum';
import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Grades,
    default: Grades.CP,
  })
  type: Grades;

  @OneToMany(() => Student, (student) => student.grade)
  @JoinColumn({ name: 'student_id' })
  students: Student[];
}
