import { Grades } from 'src/constants/enums/grades.enum';

export class ResponseStudentDto {
  lastname!: string;
  firstname!: string;
  username!: string;
  grade!: Grades;
}
