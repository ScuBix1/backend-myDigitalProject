import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 19.99, description: "Prix de l'abonnement" })
  @IsNotEmpty({ message: "Le prix de l'abonnement est obligatoire" })
  @IsNumber({}, { message: "Le prix de l'abonnement doit être un nombre" })
  price!: number;

  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  stripe_price_id!: string;

  @ApiProperty({
    example: 'monthly',
    description: "Type d'abonnement",
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  type!: SubscriptionType;
}
