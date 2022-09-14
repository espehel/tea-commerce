import { client } from './client';
import { toOrderline } from './sanity-mapper';
import Stripe from 'stripe';
import { CartEntry } from 'use-shopping-cart/core';
import groq from 'groq';

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

export const postOrder = (sessionId: string, cartEntries: Array<CartEntry>) =>
  client.create<Order>({
    _id: sessionId,
    _type: 'order',
    paymentStatus: 'requires_payment_method',
    emailStatus: 'not_sent',
    orderlines: toOrderline(cartEntries),
  });

export const getOrder = (sessionId: string) =>
  client.fetch<Order>(groq`
*[_type=="order" && _id=="${sessionId}"][0]{...}`);

export const updateOrder = (sessionId: string, updatededFields: Partial<Order>) =>
  client.patch(sessionId).set(updatededFields).commit();
