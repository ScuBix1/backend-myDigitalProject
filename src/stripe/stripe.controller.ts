import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { StripeService } from './stripe.service';

interface RawBodyRequest extends Request {
  rawBody: Buffer;
}

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('tutor')
  @Post('checkout-session')
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    const { customer_id, price_id } = createCheckoutSessionDto;
    const session = await this.stripeService.createCheckoutSession({
      price_id,
      customer_id,
    });
    return session;
  }

  @Post('webhook')
  async handleWebhook(
    @Req() request: Request,
    @Res() response: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = request.body;
    try {
      console.log(rawBody);
      await this.stripeService.handleWebhook(rawBody, signature);

      return response.status(HttpStatus.OK).send({ received: true });
    } catch {
      return response.status(HttpStatus.BAD_REQUEST).send(`Webhook Error`);
    }
  }
}
