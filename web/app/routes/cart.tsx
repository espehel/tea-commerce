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
import ProductLine from '~/components/cart/ProductLine';
import { sumQuantity } from '../../lib/utils/cart';

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
  const { cart, formattedTotalPrice, resetCart } = useCart();

  const handleCheckout = async () => {
    submit({ cart: JSON.stringify(cart.productLines) }, { method: 'post' });
  };

  const totalQuantity = cart.productLines.reduce(sumQuantity, 0);

  return (
    <article className="max-w-4xl m-auto text-center">
      <h2 className="text-6xl mb-8">Checkout</h2>
      <section className="text-left w-full border rounded p-8">
        <h3 className="text-3xl mb-4">Your order</h3>
        <ul className="divide-y border-b mb-4">
          <li className="grid grid-cols-12 py-2">
            <p className="col-span-1">Quantity</p>
            <p className="col-span-8">Product</p>
            <p className="col-span-1">Price</p>
            <p className="col-span-1">Total</p>
          </li>
          {cart.productLines.map((productLine) => (
            <ProductLine key={productLine.id} productLine={productLine} />
          ))}
        </ul>
        <div className="text-right py-2">
          <p>{`${totalQuantity} products`}</p>
          <p>Subtotal: {formattedTotalPrice}</p>
        </div>
        <div className="flex justify-between">
          <button className="outline-button" onClick={resetCart}>
            Empty cart
          </button>
          <button className="filled-button" onClick={handleCheckout}>
            Place order
          </button>
        </div>
      </section>
    </article>
  );
};

export default CartRoute;
