import { Admin } from 'src/admins/entities/admin.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Student } from 'src/students/entities/student.entity';

@Entity()
export class Tutor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  dob: Date;

  @Column()
  name: string;

  @Column()
  firstName: string;

  @ManyToOne(() => Admin, (admin) => admin.tutors)
  admin: Admin;

  @ManyToMany(() => Subscription, (subscription) => subscription.tutors)
  @JoinTable({ name: 'tutor_subscription' })
  subscriptions: Subscription[];

  @OneToMany(() => Student, (student) => student.id)
  students: Student[];
}
