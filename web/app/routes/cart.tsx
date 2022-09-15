import React, { FC } from 'react';
import { Button } from '@mui/joy';
import { useSubmit } from '@remix-run/react';
import { ActionFunction, json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getProducts } from '../../lib/sanity/simpleProductQuery';
import { createStripeSession, validateCartItems } from '../../lib/stripe/stripe.server';
import { postOrder } from '../../lib/sanity/orders';
import { toProductLines } from '../../lib/stripe/stripe-mapper';
import { useCart } from '~/states/cart/CartProvider';

export const action: ActionFunction = async ({ request }) => {
  try {
    // Validate the cart details that were sent from the client.
    const formData = (await request.formData()).get('cart');
    const productLines = toProductLines(formData);
    let sanityData = await getProducts();
    // The POST request is then validated against the data from Sanity.
    const validatedLineItems = validateCartItems(sanityData, productLines);
    // Create Checkout Sessions from body params.
    const session = await createStripeSession(
      validatedLineItems,
      `${request.headers.get('origin')}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      `${request.headers.get('origin')}`
    );
    invariant(session.url, 'No redirect url found.');
    await postOrder(session.id, productLines);
    return redirect(session.url);
  } catch (err) {
    console.error(err);
    return json(err, { status: 500 });
  }
};

const CartRoute: FC = () => {
  const submit = useSubmit();
  const { cart, formattedTotalPrice } = useCart();

  const handleCheckout = async () => {
    submit({ cart: JSON.stringify(cart.productLines) }, { method: 'post' });
  };
  return (
    <article className="max-w-4xl m-auto text-center">
      <h2 className="text-6xl mb-8">Checkout</h2>
      <section className="text-left bg-lime-900 text-white w-full p-8">
        <h3 className="text-3xl mb-4">Your order</h3>
        <ul className="divide-y border-b pb-2 mb-4">
          {cart.productLines.map(({ product }) => (
            <li key={product.id} className="grid grid-cols-2 py-2">
              <p className="">{product.name}</p>
              <p className="">{product.price}</p>
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
