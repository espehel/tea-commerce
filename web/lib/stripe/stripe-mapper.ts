import { Stripe } from 'stripe';
import { CartEntry } from 'use-shopping-cart/core';

export interface StripeConfirmation {
  email: string;
  name: string;
  status: Stripe.PaymentIntent.Status;
}

const isCartEntry = (value: unknown): value is CartEntry => {
  const cartEntry = value as CartEntry;
  return Boolean(
    cartEntry && cartEntry.id && cartEntry.price && cartEntry.name && cartEntry.quantity
  );
};

export const toCartEntries = (formData: FormDataEntryValue | null): Array<CartEntry> => {
  if (typeof formData === 'string') {
    const parsedData = JSON.parse(formData);
    const cartEntries = Object.values(parsedData).filter(isCartEntry);
    if (cartEntries.length > 0) {
      return cartEntries;
    }
  }
  throw new Error('Invalid form data');
};

export const toStripeConfirmation = (
  session: Stripe.Response<Stripe.Checkout.Session>
): StripeConfirmation | null => {
  const paymentIntent = session.payment_intent;
  if (
    typeof paymentIntent !== 'string' &&
    paymentIntent?.charges?.data[0].billing_details.email &&
    paymentIntent?.charges?.data[0].billing_details.name &&
    paymentIntent?.status
  ) {
    return {
      email: paymentIntent.charges.data[0].billing_details.email,
      name: paymentIntent.charges.data[0].billing_details.name,
      status: paymentIntent.status,
    };
  }
  return null;
};
