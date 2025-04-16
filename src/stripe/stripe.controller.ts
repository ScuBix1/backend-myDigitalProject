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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
@UseGuards(JwtAuthGuard)
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
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
    try {
      const event = await this.stripeService.handleWebhook(
        request.body,
        signature,
      );

      return response.status(HttpStatus.OK).send({ received: true });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).send(`Webhook Error`);
    }
  }
}
