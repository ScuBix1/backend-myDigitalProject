import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
export class CreateSessionDto {
  @ApiProperty({
    example: 85,
    description: "Score de l'utilisateur (valeur entre 0 et 100)",
  })
  @IsInt()
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({
    example: 1,
    description: "ID de l'étudiant associé à cette session",
  })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({
    example: 2,
    description: 'ID du jeu associé à cette session',
  })
  @IsInt()
  @IsNotEmpty()
  gameId: number;
}
