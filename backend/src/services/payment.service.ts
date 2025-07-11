import 'dotenv/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

export class PaymentService {
  static async createCheckoutSession({
    priceId,
    customerEmail,
    successUrl,
    cancelUrl,
  }: {
    priceId: string;
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }
}
