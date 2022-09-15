import Stripe from 'stripe';
import invariant from 'tiny-invariant';
import { Product } from '../sanity/simpleProductQuery';
import { info } from '../utils/logging';
import { ProductLine } from '~/states/cart/types';

const initStripe = () => {
  invariant(process.env.STRIPE_PRIVATE_KEY, 'STRIPE_PRIVATE_KEY not defined.');
  return new Stripe(process.env.STRIPE_PRIVATE_KEY, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-08-01',
  });
};

export const validateCartItems = (
  inventory: Array<Product>,
  cart: Array<ProductLine>
): Array<Stripe.Checkout.SessionCreateParams.LineItem> =>
  cart.map((cartItem) => {
    const inventoryItem = inventory.find((inventoryItem) => inventoryItem.id === cartItem.id);
    if (!inventoryItem) {
      throw new Error(`Invalid Cart: product with id "${cartItem.id}" is not in your inventory.`);
    }
    return {
      price_data: {
        currency: inventoryItem.currency,
        unit_amount: inventoryItem.price,
        product_data: {
          name: inventoryItem.name,
          images: [inventoryItem.image],
          description: inventoryItem.description,
        },
      },
      quantity: cartItem.quantity,
    };
  });

export const createStripeSession = async (
  line_items: Array<Stripe.Checkout.SessionCreateParams.LineItem>,
  success_url: string,
  cancel_url: string
) => {
  const stripe = initStripe();
  const session = await stripe.checkout.sessions.create({
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
  info('stripe', `Created session ${session.id}`);
  return session;
};

export const getStripeSession = async (sessionId: string) => {
  if (!sessionId.startsWith('cs_')) {
    throw Error('Incorrect CheckoutSession ID.');
  }
  const stripe = initStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  });
  info('stripe', `Retrieved session ${session.id}`);
  return session;
};
