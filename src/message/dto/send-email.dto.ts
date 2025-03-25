import { Address } from 'nodemailer';

export class SendEmailDto {
  sender?: Address;
  recipients: Address[];
  subject: string;
  html: string;
  text?: string;
}
