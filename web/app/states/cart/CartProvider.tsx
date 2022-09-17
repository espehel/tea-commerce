import { createContext, FC, useContext, useEffect, useMemo } from 'react';
import { CartState, useCartReducer } from '~/states/cart/cart-reducer';
import invariant from 'tiny-invariant';
import { useFormattedTotalPrice } from '~/states/cart/cart-hooks';
import { ProductLine } from './types';
import { getItemFromLocalStorage, setItemToLocalStorage } from '../../../lib/utils/localstorage';

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
  const { cart, addProduct, setCart } = useCartReducer();

  const formattedTotalPrice = useFormattedTotalPrice(cart);

  useEffect(() => {
    if (cart.productLines.length === 0) {
      const productLines = getItemFromLocalStorage<Array<ProductLine>>(
        'tea-commerce.product-lines'
      );
      if (productLines && productLines.length > 0) {
        setCart({ productLines });
      }
    } else {
      setItemToLocalStorage('tea-commerce.product-lines', cart.productLines);
    }
  }, [cart]);

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
