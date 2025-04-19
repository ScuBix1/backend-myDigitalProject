import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreateSessionDto } from './create-session.dto';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
  score!: number;
}
