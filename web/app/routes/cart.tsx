import React, { FC } from 'react';
import { useShoppingCart } from 'use-shopping-cart';
import { CartState } from 'use-shopping-cart/core';
import { Button } from '@mui/joy';
import { useSubmit } from '@remix-run/react';
import { ActionFunction, json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getProducts } from '../../lib/sanity/simpleProductQuery';
import { createStripeSession, validateCartItems } from '../../lib/stripe/stripe.server';
import { postOrder } from '../../lib/sanity/orders';
import { toCartEntries } from '../../lib/stripe/stripe-mapper';

export const action: ActionFunction = async ({ request }) => {
  try {
    // Validate the cart details that were sent from the client.
    const formData = (await request.formData()).get('cartDetails');
    const cartEntries = toCartEntries(formData);
    let sanityData = await getProducts();
    // The POST request is then validated against the data from Sanity.
    const validatedLineItems = validateCartItems(sanityData, cartEntries);
    // Create Checkout Sessions from body params.
    const session = await createStripeSession(
      validatedLineItems,
      `${request.headers.get('origin')}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      `${request.headers.get('origin')}`
    );
    invariant(session.url, 'No redirect url found.');
    await postOrder(session.id, cartEntries);
    return redirect(session.url);
  } catch (err) {
    console.error(err);
    return json(err, { status: 500 });
  }
};

const CartRoute: FC = () => {
  const submit = useSubmit();
  const { cartDetails, formattedTotalPrice } = useShoppingCart<CartState>();

  const handleCheckout = async () => {
    submit({ cartDetails: JSON.stringify(cartDetails) }, { method: 'post' });
  };
  return (
    <article className="max-w-4xl m-auto text-center">
      <h2 className="text-6xl mb-8">Checkout</h2>
      <section className="text-left bg-lime-900 text-white w-full p-8">
        <h3 className="text-3xl mb-4">Your order</h3>
        <ul className="divide-y border-b pb-2 mb-4">
          {Object.values(cartDetails).map((entry) => (
            <li key={entry.id} className="grid grid-cols-2 py-2">
              <p className="">{entry.name}</p>
              <p className="">{entry.formattedValue}</p>
            </li>
          ))}
          <li className="grid grid-cols-2 py-2">
            <p>Subtotal: </p>
            <p>{formattedTotalPrice}</p>
          </li>
        </ul>
        <Button onClick={handleCheckout}>Place order</Button>
      </section>
    </article>
  );
};

export default CartRoute;
