import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Grades } from 'src/constants/enums/grades.enum';

export class CreateStudentDto {
  @ApiProperty({ example: 'Doe', description: "Nom de l'étudiant" })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'John', description: "Prénom de l'étudiant" })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    example: 'johndoe123',
    description: "Nom d'utilisateur unique",
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'Mypassword123!',
    description: 'Mot de passe sécurisé',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: '2025-03-11T08:00:00.000Z',
    description: 'Heure de début de session (format ISO)',
  })
  @IsNotEmpty()
  @IsDateString()
  start_hour: string;

  @ApiProperty({ example: 60, description: 'Durée de la session en minutes' })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({ example: 1, description: "ID du tuteur associé à l'étudiant" })
  @IsNotEmpty()
  @IsInt()
  tutor_id: number;

  @ApiProperty({
    example: 'cm1',
    description: 'Niveau de classe de l\’élève',
    enumName: 'Grades',
    enum: Grades,
  })
  @IsEnum(Grades)
  @IsNotEmpty()
  grade: Grades;
}
