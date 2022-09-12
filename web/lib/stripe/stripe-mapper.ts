import { Stripe } from 'stripe';

export interface StripeConfirmation {
  email: string;
  name: string;
  status: Stripe.PaymentIntent.Status;
}

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
