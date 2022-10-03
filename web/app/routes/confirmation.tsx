import React, { FC, useEffect } from 'react';
import { json, LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import PrintObject from '../components/PrintObject';
import { getStripeSession, getStripeSessionLineItems } from '../../lib/stripe/stripe.server';
import { sendMail } from '../../lib/mailjet/mailjet.server';
import { toStripeConfirmation } from '../../lib/stripe/stripe-mapper';
import { getOrder, updateOrder } from '../../lib/sanity/orders';
import { formatNok } from '../../lib/utils/format';
import Typography from '@mui/joy/Typography';
import { useCart } from '~/states/cart/CartProvider';

export async function loader({ request }: LoaderArgs) {
  const id = new URL(request.url).searchParams.get('session_id');
  invariant(id, 'Expected search params session_id');
  try {
    const checkoutSession = await getStripeSession(id);
    const lineItems = await getStripeSessionLineItems(id);
    const order = await getOrder(id);
    const stripeConfirmation = toStripeConfirmation(checkoutSession);
    invariant(stripeConfirmation, 'Could not map session to StripeConfirmation.');

    if (order.emailStatus === 'not_sent') {
      await sendMail(stripeConfirmation);
      await updateOrder(id, { emailStatus: 'sent', paymentStatus: stripeConfirmation.status });
    }

    return json({ checkoutSession, stripeConfirmation, lineItems });
  } catch (err: any) {
    throw new Response(err.message, { status: 500 });
  }
}

const Result: FC = ({}) => {
  const { resetCart } = useCart();
  const { checkoutSession, stripeConfirmation, lineItems } = useLoaderData<typeof loader>();

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  return (
    <article className="max-w-4xl m-auto text-center">
      <Typography level="h2">Order received</Typography>
      <p>
        Thank you, {stripeConfirmation.name}, a confirmation email has been sent to{' '}
        {stripeConfirmation.email}.
      </p>
      <section className="text-left">
        <Typography level="h3">Ordered items</Typography>
        <ul>
          {lineItems.map((lineItem) => (
            <li key={lineItem.id}>{`${lineItem.quantity} ${lineItem.description} for ${formatNok(
              lineItem.amount_total / 100
            )}`}</li>
          ))}
        </ul>
        <p>Total: {formatNok((checkoutSession?.amount_total || 0) / 100)}</p>
      </section>
      <section className="text-left">
        <Typography level="h3">Delivery</Typography>
        <p>Name: {checkoutSession?.shipping_details?.name}</p>
        <p>Country: {checkoutSession?.shipping_details?.address?.country}</p>
        <p>State: {checkoutSession?.shipping_details?.address?.state}</p>
        <p>Postal code: {checkoutSession?.shipping_details?.address?.postal_code}</p>
        <p>City: {checkoutSession?.shipping_details?.address?.city}</p>
        <p>Address 1: {checkoutSession?.shipping_details?.address?.line1}</p>
        <p>Address 2: {checkoutSession?.shipping_details?.address?.line2}</p>
        <p>Phone: {checkoutSession?.shipping_details?.phone}</p>
      </section>
      <section className="text-right">
        <Link className="filled-button" to="/">
          Order more
        </Link>
      </section>
    </article>
  );
};

export default Result;
