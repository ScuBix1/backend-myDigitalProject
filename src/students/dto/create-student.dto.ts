import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
    example: 2,
    description: "ID du niveau scolaire de l'étudiant",
  })
  @IsNotEmpty()
  @IsInt()
  grade_id: number;

  @ApiProperty({
    example: [3, 4],
    description: 'Liste des IDs des sessions associées',
  })
  @IsOptional()
  @IsInt({ each: true })
  sessions_id?: number[];

  @ApiProperty({
    example: '2025-03-11T08:00:00.000Z',
    description: "Date de création de l'étudiant",
  })
  @IsOptional()
  @IsDateString()
  created_at?: string;
}
