import { createContext, FC, useContext, useMemo } from 'react';
import { CartState, useCartReducer } from '~/states/cart/cart-reducer';
import invariant from 'tiny-invariant';
import { useFormattedTotalPrice } from '~/states/cart/cart-hooks';
import { ProductLine } from './types';

interface ContextValue {
  cart: CartState;
  formattedTotalPrice: string;
  addProduct: (productLine: ProductLine) => void;
}

interface Props {
  stripePublicKey: string;
}

export const CartContext = createContext<ContextValue | undefined>(undefined);

export const CartProvider: FC<Props> = ({ stripePublicKey, children }) => {
  const { cart, addProduct } = useCartReducer();

  const formattedTotalPrice = useFormattedTotalPrice(cart);

  const contextValue = useMemo<ContextValue>(
    () => ({
      cart,
      formattedTotalPrice,
      addProduct,
    }),
    [cart]
  );
  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = (): ContextValue => {
  const context = useContext(CartContext);
  invariant(context, 'useCart must be used within a CartProvider');
  return context;
};
