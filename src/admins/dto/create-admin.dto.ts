import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Tutor } from 'src/tutors/entities/tutor.entity';

export class CreateAdminDto {
  @IsBoolean()
  @IsNotEmpty()
  manage_tutors: boolean;

  @IsBoolean()
  @IsNotEmpty()
  manage_subscriptions: boolean;

  @IsBoolean()
  @IsNotEmpty()
  manage_games: boolean;

  @IsOptional()
  tutors?: Tutor[];

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
