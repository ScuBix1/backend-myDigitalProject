import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
export class CreateSessionDto {
  @ApiProperty({
    example: 85,
    description: "Score de l'utilisateur (valeur entre 0 et 100)",
  })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  @Min(0, { message: i18nValidationMessage('validation.min', { min: 0 }) })
  @Max(100, { message: i18nValidationMessage('validation.max', { max: 100 }) })
  score!: number;

  @ApiProperty({
    example: 1,
    description: "ID de l'étudiant associé à cette session",
  })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  student_id!: number;

  @ApiProperty({
    example: 2,
    description: 'ID du jeu associé à cette session',
  })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  game_id!: number;
}
