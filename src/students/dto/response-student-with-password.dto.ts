import { Expose } from 'class-transformer';
import { Grades } from 'src/constants/enums/grades.enum';

export class ResponseStudentWithPasswordDto {
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
  password!: string;
}
