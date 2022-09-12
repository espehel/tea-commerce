import React, { FC } from 'react';
import { json, LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import PrintObject from '../components/PrintObject';
import { getStripeSession } from '../../lib/stripe/stripe.server';
import { sendMail } from '../../lib/mailjet/mailjet.server';
import { toStripeConfirmation } from '../../lib/stripe/stripe-mapper';

export async function loader({ request }: LoaderArgs) {
  const id = new URL(request.url).searchParams.get('session_id');
  invariant(id, 'Expected search params session_id');
  try {
    const checkoutSession = await getStripeSession(id);
    const stripeConfirmation = toStripeConfirmation(checkoutSession);
    invariant(stripeConfirmation, 'Could not map session to StripeConfirmation.');

    await sendMail(stripeConfirmation);

    return json({ checkoutSession, stripeConfirmation });
  } catch (err: any) {
    throw new Response(err.message, { status: 500 });
  }
}

const Result: FC = ({}) => {
  const { checkoutSession, stripeConfirmation } = useLoaderData<typeof loader>();

  return (
    <article className="max-w-4xl m-auto text-center">
      <h2 className="text-6xl mb-8">Order received</h2>
      <p>With the data below, you can display a custom confirmation message to your customer.</p>
      <h3>Thank you, {stripeConfirmation.name}.</h3>
      <p>Confirmation email sent to {stripeConfirmation.email}.</p>
      <Link className="font-bold" to="/">
        Order more
      </Link>
      <hr />
      <h2>Status: {stripeConfirmation.status}</h2>
      <h3>CheckoutSession response:</h3>
      <PrintObject content={checkoutSession} />
    </article>
  );
};

export default Result;
