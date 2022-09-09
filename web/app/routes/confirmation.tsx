import React, { FC } from 'react';
import { json, LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import PrintObject from '../components/PrintObject';
import { getStripeSession } from '../../lib/stripe/stripe.server';

export async function loader({ request }: LoaderArgs) {
  const id = new URL(request.url).searchParams.get('session_id');
  invariant(id, 'Expected search params session_id');
  try {
    const checkoutSession = await getStripeSession(id);
    return json({ checkoutSession });
  } catch (err: any) {
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
    <article className="max-w-4xl m-auto text-center">
      <h2 className="text-6xl mb-8">Order received</h2>
      <p>With the data below, you can display a custom confirmation message to your customer.</p>
      <h3>Thank you, {paymentIntent?.charges?.data[0].billing_details.name}.</h3>
      <p>Confirmation email sent to {paymentIntent?.charges?.data[0].billing_details.email}.</p>
      <Link className="font-bold" to="/">
        Order more
      </Link>
      <hr />
      <h2>Status: {paymentIntent?.status ?? 'loading...'}</h2>
      <h3>CheckoutSession response:</h3>
      <PrintObject content={checkoutSession ?? 'loading...'} />
    </article>
  );
};

export default Result;
