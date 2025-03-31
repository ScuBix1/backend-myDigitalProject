import { Body, Controller, Post } from '@nestjs/common';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

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
}
