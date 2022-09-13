import { client } from './client';
import { toOrderline } from './sanity-mapper';
import Stripe from 'stripe';
import { CartEntry } from 'use-shopping-cart/core';

export interface Orderline {
  productName: string;
  productRef: { _type: string; _ref: string };
  _key: string;
}

export interface Order {
  _id: string;
  paymentStatus: string;
  emailStatus: string;
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
