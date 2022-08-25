import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: undefined | Promise<Stripe | null>;
const getStripe = (stripePublicKey: string) => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

export default getStripe;
