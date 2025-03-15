import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
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
  @IsNotEmpty()
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
    type: Admin['id'],
    required: true,
  })
  @IsNotEmpty()
  admin_id: number;

  subscriptions: Subscription[];

  students: Student[];

  created_at: Date;
}
