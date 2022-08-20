import Cart from '~/components/Cart';
import Products from '~/components/Products';
import { Link, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderArgs, redirect } from '@remix-run/node';
import { client } from '../../lib/sanity/client';
import { merchQuery } from '../../lib/sanity/merchQuery';
import { Product } from '../../types/product';
import CartSummary from '~/components/CartSummary';
import Stripe from 'stripe';
import { validateCartItems } from 'use-shopping-cart/src/serverUtil';
import invariant from 'tiny-invariant';

export async function loader({ request, params }: LoaderArgs) {
  const products = await client.fetch<Array<Product>>(merchQuery);
  return json({
    products,
    ENV: {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  });
}

export const action: ActionFunction = async ({ request }) => {
  console.log('pkey: ', process.env.STRIPE_PRIVATE_KEY);
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-08-01',
  });
  try {
    // Validate the cart details that were sent from the client.
    const formData = (await request.formData()).get('cartDetails');
    if (typeof formData !== 'string') {
      throw new Error('Invalid form data');
    }
    const cartDetails = JSON.parse(formData);
    //Sanity client performs merchQuery
    let sanityData = await client.fetch(merchQuery);
    // The POST request is then validated against the data from Sanity.
    const line_items = validateCartItems(sanityData, cartDetails);
    // Create Checkout Sessions from body params.
    const checkoutSession = await stripe.checkout.sessions.create({
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['NO'],
      },
      //The validated cart items are inserted.
      line_items,
      success_url: `${request.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}`,
    });
    console.log('returning', checkoutSession);
    invariant(checkoutSession.url, 'No redirect url found.');
    return redirect(checkoutSession.url);
    //return json(checkoutSession, { status: 200 });
  } catch (err) {
    return json(err, { status: 500 });
  }
};

export default function Index() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <>
      <nav style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
        <ul>
          <li>
            <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
              15m Quickstart Blog Tutorial
            </a>
          </li>
          <li>
            <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer">
              Deep Dive Jokes App Tutorial
            </a>
          </li>
          <li>
            <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
              Remix Docs
            </a>
          </li>
        </ul>
      </nav>
      <main>
        <h1>My Merch Store</h1>
        <p>
          Powered by the <a href="https://useshoppingcart.com">use-shopping-cart</a> React hooks
          library.
        </p>
        <Cart>
          <>
            <Products products={products} />
            <CartSummary />
          </>
        </Cart>
        <Link to="/">Back Home</Link>
      </main>
    </>
  );
}
