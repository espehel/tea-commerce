import { CartProvider as StripeProvider } from 'use-shopping-cart';
import { FC } from 'react';

interface Props {
  stripePublicKey: string;
}

export const CartProvider: FC<Props> = ({ stripePublicKey, children }) => {
  return (
    <StripeProvider cartMode="checkout-session" stripe={stripePublicKey} currency={'nok'}>
      {children}
    </StripeProvider>
  );
};

export default CartProvider;
