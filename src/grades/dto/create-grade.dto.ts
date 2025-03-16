import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Grades } from 'src/constants/enums/grades.enum';

export class CreateGradeDto {
  @ApiProperty({
    example: 'cm1',
    description: 'Niveau de classe de l\’élève',
    enumName: 'Grades',
    enum: Grades,
  })
  @IsEnum(Grades)
  @IsNotEmpty()
  type: Grades;
}
