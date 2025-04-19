import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginStudentDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  username!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  password!: string;
}
