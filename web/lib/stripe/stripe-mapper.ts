import { Stripe } from 'stripe';
import { isProductLine, ProductLine } from '~/states/cart/types';

export interface StripeConfirmation {
  email: string;
  name: string;
  status: Stripe.PaymentIntent.Status;
}

export const toProductLines = (formData: FormDataEntryValue | null): Array<ProductLine> => {
  if (typeof formData === 'string') {
    const parsedData = JSON.parse(formData);
    if (Array.isArray(parsedData)) {
      const productLines = parsedData.filter(isProductLine);
      if (productLines.length > 0) {
        return productLines;
      }
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
