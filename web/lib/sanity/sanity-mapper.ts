import { Orderline } from './orders';
import { CartEntry } from 'use-shopping-cart/core';

export const toOrderline = (cartEntries: Array<CartEntry>): Array<Orderline> =>
  cartEntries.map((entry) => ({
    productName: entry.name,
    productRef: { _type: 'reference', _ref: entry.id },
    _key: entry.id,
  }));
