import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Grade } from 'src/grades/entities/grade.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Tutor } from 'src/tutors/entities/tutor.entity';

export class CreateStudentDto {
  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsDate()
  start_hour: Date;

  @IsNumber()
  duration: number;

  @IsNotEmpty()
  tutor: Tutor;

  @IsNotEmpty()
  grade: Grade;

  @IsNotEmpty()
  sessions: Session[];

  @IsDate()
  created_at: Date;
}
