import Stripe from 'stripe';
import invariant from 'tiny-invariant';
import { ValidatedItem } from 'use-shopping-cart/utilities/serverless';

const initStripe = () => {
  invariant(process.env.STRIPE_PRIVATE_KEY, 'STRIPE_PRIVATE_KEY not defined.');
  return new Stripe(process.env.STRIPE_PRIVATE_KEY, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-08-01',
  });
};

export const createStripeSession = async (
  line_items: Array<ValidatedItem>,
  success_url: string,
  cancel_url: string
) => {
  const stripe = initStripe();
  return stripe.checkout.sessions.create({
    submit_type: 'pay',
    mode: 'payment',
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['NO'],
    },
    line_items,
    success_url,
    cancel_url,
  });
};

export const getStripeSession = async (sessionId: string) => {
  if (!sessionId.startsWith('cs_')) {
    throw Error('Incorrect CheckoutSession ID.');
  }
  const stripe = initStripe();
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  });
};
