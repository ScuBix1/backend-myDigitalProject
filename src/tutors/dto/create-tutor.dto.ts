import { IsEmail, IsNotEmpty } from 'class-validator';
import { Admin } from 'src/admins/entities/admin.entity';
import { Student } from 'src/students/entities/student.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
export class CreateTutorDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  dob: Date;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  adminId: Admin;

  subscriptions: Subscription[];

  students: Student[];

  created_at: Date;
}
