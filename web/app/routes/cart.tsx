import React, { FC } from 'react';
import { useShoppingCart } from 'use-shopping-cart';
import { CartState } from 'use-shopping-cart/core';

const CartRoute: FC = ({}) => {
  const { cartDetails, formattedTotalPrice } = useShoppingCart<CartState>();

  return (
    <article className="max-w-4xl m-auto text-center">
      <h2 className="text-6xl mb-8">Checkout</h2>
      <section className="text-left bg-lime-900 text-white w-full p-8">
        <h3 className="text-3xl mb-4">Your order</h3>
        <ul className="divide-y">
          {Object.values(cartDetails).map((entry) => (
            <li key={entry.id} className="grid grid-cols-2">
              <p className="">{entry.name}</p>
              <p className="">{entry.formattedValue}</p>
            </li>
          ))}
          <li className="grid grid-cols-2">
            <p>Subtotal: </p>
            <p>{formattedTotalPrice}</p>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default CartRoute;
