import { Grades } from 'src/constants/enums/grades.enum';
import { Student } from 'src/students/entities/student.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Student, (student) => student.id)
  students: Student[];
}
