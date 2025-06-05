import { Expose } from 'class-transformer';
import { Grades } from 'src/constants/enums/grades.enum';

export class ResponseStudentDto {
  @Expose()
  id!: number;
  @Expose()
  lastname!: string;
  @Expose()
  firstname!: string;
  @Expose()
  username!: string;
  @Expose()
  grade!: Grades;
  @Expose()
  avatar!: string;
  @Expose()
  duration?: number;
}
