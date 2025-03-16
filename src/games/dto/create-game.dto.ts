import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Grades } from 'src/constants/enums/grades.enum';

export class CreateGameDto {
  @ApiProperty({
    example: 'Morpion',
    description: 'Nom du jeu',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '/src/jeu/nom',
    description: "Chemin vers l'emplacement du jeu",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  path: string;

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
