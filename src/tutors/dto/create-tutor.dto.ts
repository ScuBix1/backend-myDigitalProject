import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Admin } from 'src/admins/entities/admin.entity';
import { Student } from 'src/students/entities/student.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

export class CreateTutorDto {
  @ApiProperty({
    example: 'email@email.fr',
    description: 'Email du tuteur',
    type: String,
    required: true,
  })
  @IsEmail({}, { message: "L'email est invalide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
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

  @ApiProperty({
    example: '2001/02/17',
    description: 'Date de naissance',
    type: Date,
    required: true,
  })
  @IsNotEmpty()
  dob: Date;

  @ApiProperty({
    example: 'Doe',
    description: 'Nom de la personne',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    example: 'John',
    description: 'Prénom de la personne',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    example: '1',
    description: "Id de l'admin associé",
    type: Admin,
    required: true,
  })
  @IsNotEmpty()
  admin_id: number;

  @ApiProperty({
    type: String,
    example: 'cus_N1aB2C3D4E5F6G',
    description: 'ID du client stripe associé au tuteur',
  })
  @IsString()
  @IsNotEmpty()
  customer_id: string;

  subscriptions: Subscription[];

  students: Student[];

  created_at: Date;
}
