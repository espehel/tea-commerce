import { CartProvider } from 'use-shopping-cart';
import getStripe from '../../lib/stripe/getStripe';
import { FC } from 'react';

interface Props {
  children: JSX.Element;
  stripePublicKey: string;
}

export const CartContext: FC<Props> = ({ stripePublicKey, children }) => {
  return (
    <CartProvider mode="checkout-session" stripe={getStripe(stripePublicKey)} currency={'nok'}>
      {children}
    </CartProvider>
  );
};

export default CartContext;
