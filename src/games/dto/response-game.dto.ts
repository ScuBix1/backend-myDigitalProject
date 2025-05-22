import { Grades } from 'src/constants/enums/grades.enum';

export class ResponseGameDto {
  name!: string;
  score!: number;
  grade!: Grades;
}
