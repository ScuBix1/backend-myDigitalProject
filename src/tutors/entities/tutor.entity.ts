import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Admin } from 'src/admins/entities/admin.entity';
import { Student } from 'src/students/entities/student.entity';
import { TutorSubscription } from 'src/subscriptions/entities/tutorSubscription.entity';
import { Verification } from 'src/verification/entities/verification.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tutor {
  @ApiProperty({ type: Number, example: 1, description: 'ID du tuteur' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    example: 'email@email.fr',
    description: 'Email du tuteur',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Azertyuiop123456789!',
    description:
      'Mot de passe du tuteur (1 majuscule, 1 minuscule, 8 caractères minimum, 1 caractère spéciale) ',
  })
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    type: Date,
    example: '20001/02/17',
    description: 'Date de naissance du tuteur',
  })
  @Column()
  dob: Date;

  @ApiProperty({
    type: String,
    example: 'Doe',
    description: 'Nom du tuteur',
  })
  @Column()
  lastname: string;

  @ApiProperty({
    type: String,
    example: 'John',
    description: 'Prénom du tuteur',
  })
  @Column()
  firstname: string;

  @ApiProperty({
    type: String,
    example: 'cus_N1aB2C3D4E5F6G',
    description: 'ID du client stripe associé au tuteur',
  })
  @Column()
  customer_id: string;

  @Column({ default: 'inactif' })
  account_status: 'actif' | 'inactif';

  @Column({ nullable: true })
  email_verified_at: Date;

  @ApiProperty({
    type: Number,
    example: 3,
    description: "ID de l'administrateur qui à les droits sur le tuteur",
  })
  @ManyToOne(() => Admin, (admin) => admin.tutors)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @OneToMany(() => TutorSubscription, (ts) => ts.tutor)
  tutorSubscriptions: TutorSubscription[];

  @OneToMany(() => Student, (student) => student.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  students: Student[];

  @OneToMany(() => Verification, (verification) => verification.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'verification_id' })
  verifications: Verification[];
}
