import { CartProvider } from 'use-shopping-cart';
import getStripe from '../../lib/stripe/getStripe';
import { FC } from 'react';
import { useLoaderData } from '@remix-run/react';
import { loader } from '~/routes';

interface Props {
  children: JSX.Element;
}

export const Cart: FC<Props> = ({ children }) => {
  const { ENV } = useLoaderData<typeof loader>();
  return (
    <CartProvider
      mode="checkout-session"
      stripe={getStripe(ENV.STRIPE_PUBLIC_KEY)}
      currency={'nok'}
    >
      {children}
    </CartProvider>
  );
};

export default Cart;
