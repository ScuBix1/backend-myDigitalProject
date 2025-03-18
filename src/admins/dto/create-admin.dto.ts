import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

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

  @ApiProperty({
    example: '1',
    description: 'Id du tuteur',
    type: Number,
    required: false,
  })
  @IsNotEmpty()
  tutor_id: number;

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
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
  })
  password: string;
}
