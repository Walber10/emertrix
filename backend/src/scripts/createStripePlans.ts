import 'dotenv/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

const plans = [
  {
    tier: 'TIER1',
    name: 'Tier 1',
    annual: 189900, //
    monthly: 19000, // $190.00 in cents
    occupants: 50,
    facilities: 1,
  },
  {
    tier: 'TIER2',
    name: 'Tier 2',
    annual: 299900, // $2999.00 in cents
    monthly: 29900, // $299.00 in cents
    occupants: 100,
    facilities: 1,
  },
  {
    tier: 'TIER3',
    name: 'Tier 3',
    annual: 499900, // $4999.00 in cents
    monthly: 49900, // $499.00 in cents
    occupants: 300,
    facilities: 2,
  },
  {
    tier: 'ENTERPRISE',
    name: 'Enterprise',
    annual: null, // Custom pricing
    monthly: null, // Custom pricing
    occupants: null,
    facilities: null,
  },
];

async function main() {
  for (const plan of plans) {
    // Create product
    const product = await stripe.products.create({
      name: plan.name,
      metadata: {
        tier: plan.tier,
        occupants: plan.occupants?.toString() ?? '',
        facilities: plan.facilities?.toString() ?? '',
      },
    });
    console.log(`Created product for ${plan.tier}: ${product.id}`);

    // Only create prices for non-enterprise
    if (plan.annual && plan.monthly) {
      // Yearly price
      const yearly = await stripe.prices.create({
        unit_amount: plan.annual,
        currency: 'aud', // changed from 'usd' to 'aud'
        recurring: { interval: 'year' },
        product: product.id,
      });
      console.log(`  Yearly price: ${yearly.id}`);

      // Monthly price
      const monthly = await stripe.prices.create({
        unit_amount: plan.monthly,
        currency: 'aud', // changed from 'usd' to 'aud'
        recurring: { interval: 'month' },
        product: product.id,
      });
    } else {
      console.log(`  Skipped price creation for ${plan.tier} (custom pricing)`);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
