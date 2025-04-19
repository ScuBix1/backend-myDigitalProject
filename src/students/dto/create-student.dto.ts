import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Grades } from 'src/constants/enums/grades.enum';

export class CreateStudentDto {
  @ApiProperty({ example: 'Doe', description: "Nom de l'étudiant" })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  lastname!: string;

  @ApiProperty({ example: 'John', description: "Prénom de l'étudiant" })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  firstname!: string;

  @ApiProperty({
    example: 'johndoe123',
    description: "Nom d'utilisateur unique",
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  username!: string;

  @ApiProperty({
    example: 'Mypassword123!',
    description: 'Mot de passe sécurisé',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  password!: string;

  @ApiProperty({
    example: '2025-03-11T08:00:00.000Z',
    description: 'Heure de début de session (format ISO)',
  })
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.isDateString') },
  )
  @IsOptional()
  start_hour?: string;

  @ApiProperty({ example: 60, description: 'Durée de la session en minutes' })
  @IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
  @IsOptional()
  duration?: number;

  @ApiProperty({ example: 1, description: "ID du tuteur associé à l'étudiant" })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  tutor_id!: number;

  @ApiProperty({
    example: 'cm1',
    description: 'Niveau de classe de l’élève',
    enumName: 'Grades',
    enum: Grades,
  })
  @IsEnum(Grades, { message: i18nValidationMessage('validation.isEnum') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  grade!: Grades;
}
