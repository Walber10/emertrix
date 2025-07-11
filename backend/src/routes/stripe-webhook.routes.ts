import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../database/connectToDB';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const amount = session.amount_total ? session.amount_total / 100 : 0;
      const currency = session.currency || 'aud';

      await prisma.payment.updateMany({
        where: { stripeSessionId: session.id },
        data: {
          status: 'COMPLETED',
          amount: amount,
          currency: currency,
        },
      });
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export { router as stripeWebhookRouter };
