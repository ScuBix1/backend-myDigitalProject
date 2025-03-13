import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Tutor } from 'src/tutors/entities/tutor.entity';

export class CreateAdminDto {
  @ApiProperty({
    example: 'true',
    description: 'Autorisation pour modifier les tuteurs',
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  manage_tutors: boolean;

  @ApiProperty({
    example: 'true',
    description: 'Autorisation pour modifier les abonnements',
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  manage_subscriptions: boolean;

  @ApiProperty({
    example: 'true',
    description: 'Autorisation pour modifier les jeux',
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  manage_games: boolean;

  @IsOptional()
  tutors?: Tutor[];

  @ApiProperty({
    example: 'email@email.fr',
    description: "Email de l'admin",
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Azertyuiop123456789!',
    description:
      'Mot de passe avec minimum 8 caractères, 1 chiffre, 1 caractère spécial, 1 majuscule, 1 minuscule ',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  password: string;
}
