import React, { FC } from 'react';
import { json, LoaderArgs } from '@remix-run/node';
import Stripe from 'stripe';
import { Link, useLoaderData } from '@remix-run/react';
import PrintObject from '~/components/PrintObject';
import invariant from 'tiny-invariant';

export async function loader({ request, params }: LoaderArgs) {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-08-01',
  });
  const id = new URL(request.url).searchParams.get('session_id');
  invariant(id, 'Expected search params session_id');
  try {
    if (!id.startsWith('cs_')) {
      throw Error('Incorrect CheckoutSession ID.');
    }
    const checkoutSession = await stripe.checkout.sessions.retrieve(id, {
      expand: ['payment_intent'],
    });

    return json({ checkoutSession });
  } catch (err: any) {
    console.log(err);
    throw new Response(err.message, { status: 500 });
  }
}

const Result: FC = ({}) => {
  const { checkoutSession } = useLoaderData<typeof loader>();
  const paymentIntent = checkoutSession.payment_intent;

  if (typeof paymentIntent === 'string') {
    throw new Error('Payment intent is string');
  }

  return (
    <div className="page-container">
      Congrats
      <h1>Checkout Payment Result</h1>
      <p>With the data below, you can display a custom confirmation message to your customer.</p>
      <p>For example:</p>
      <hr />
      <h3>Thank you, {paymentIntent?.charges.data[0].billing_details.name}.</h3>
      <p>Confirmation email sent to {paymentIntent?.charges.data[0].billing_details.email}.</p>
      <hr />
      <h2>Status: {paymentIntent?.status ?? 'loading...'}</h2>
      <h3>CheckoutSession response:</h3>
      <PrintObject content={checkoutSession ?? 'loading...'} />
      <Link to="/">
        <a>Back home</a>
      </Link>
    </div>
  );
};

export default Result;
