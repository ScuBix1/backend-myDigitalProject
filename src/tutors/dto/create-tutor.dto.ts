import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
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
  @IsEmail({}, { message: i18nValidationMessage('validation.isEmail') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  email!: string;

  @ApiProperty({
    example: 'Azertyuiop123456789!',
    description:
      'Mot de passe avec minimum 8 caractères, 1 chiffre, 1 caractère spécial, 1 majuscule, 1 minuscule ',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @MinLength(8, {
    message: i18nValidationMessage('validation.minLength', {
      messageArgs: { minLength: 8 },
    }),
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: i18nValidationMessage('validation.matches'),
  })
  password!: string;

  @ApiProperty({
    example: '2001/02/17',
    description: 'Date de naissance',
    type: Date,
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsDateString({}, { message: i18nValidationMessage('validation.isDate') })
  dob!: Date;

  @ApiProperty({
    example: 'Doe',
    description: 'Nom de la personne',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  lastname!: string;

  @ApiProperty({
    example: 'John',
    description: 'Prénom de la personne',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  firstname!: string;

  @ApiProperty({
    example: '1',
    description: "Id de l'admin associé",
    type: Admin,
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  admin_id!: number;

  customer_id!: string | null;

  subscriptions?: Subscription[];

  students?: Student[];

  created_at!: Date;
}
