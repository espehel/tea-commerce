import { useMemo } from 'react';
import { CartState } from './cart-reducer';

export const useFormattedTotalPrice = (cart: CartState) =>
  useMemo(() => {
    const total = cart.productLines.reduce(
      (acc, currentLine) => acc + currentLine.product.price * currentLine.quantity,
      0
    );
    return new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
    }).format(total);
  }, [cart]);
