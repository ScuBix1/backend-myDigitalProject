import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Grades } from 'src/constants/enums/grades.enum';

export class CreateGameDto {
  @ApiProperty({
    example: 'Morpion',
    description: 'Nom du jeu',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 85,
    description: "Score de l'utilisateur (valeur entre 0 et 100)",
    type: Number,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  score!: number;

  @ApiProperty({
    example: '/src/jeu/nom',
    description: "Chemin vers l'emplacement du jeu",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  path!: string;

  @ApiProperty({
    example: 'cm1',
    description: 'Niveau de classe de l’élève',
    enumName: 'Grades',
    enum: Grades,
  })
  @IsEnum(Grades)
  @IsNotEmpty()
  grade!: Grades;
}
