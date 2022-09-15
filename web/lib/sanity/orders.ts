import { client } from './client';
import { toOrderline } from './sanity-mapper';
import Stripe from 'stripe';
import groq from 'groq';
import { info } from '../utils/logging';
import { ProductLine } from '~/states/cart/types';

export interface Orderline {
  productName: string;
  productRef: { _type: string; _ref: string };
  _key: string;
}

export interface Order {
  _id: string;
  paymentStatus: Stripe.PaymentIntent.Status;
  emailStatus: 'not_sent' | 'sent';
  orderlines: Array<Orderline>;
}

export const postOrder = async (sessionId: string, productLines: Array<ProductLine>) => {
  const result = await client.create<Order>({
    _id: sessionId,
    _type: 'order',
    paymentStatus: 'requires_payment_method',
    emailStatus: 'not_sent',
    orderlines: toOrderline(productLines),
  });
  info('sanity', `Created order ${result._id}`);
  return result;
};

export const getOrder = (sessionId: string) =>
  client.fetch<Order>(groq`
*[_type=="order" && _id=="${sessionId}"][0]{...}`);

export const updateOrder = async (sessionId: string, updatededFields: Partial<Order>) => {
  const result = await client.patch(sessionId).set(updatededFields).commit();
  info('sanity', `Patched order ${result._id}`);
  return result;
};
