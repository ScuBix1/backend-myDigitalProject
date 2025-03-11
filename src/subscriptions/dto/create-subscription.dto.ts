import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 19.99, description: "Prix de l'abonnement" })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'INDIVIDUAL',
    enum: SubscriptionType,
    description: "Type d'abonnement",
  })
  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  type: SubscriptionType;

  @ApiProperty({
    example: '2025-03-11T00:00:00.000Z',
    description: 'Date de début (format ISO)',
  })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({
    example: '2026-03-11T00:00:00.000Z',
    description: 'Date de fin (format ISO)',
  })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @ApiProperty({
    example: [1, 2],
    description: 'Liste des IDs des tuteurs associés',
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  tutors_id: number[];
}
