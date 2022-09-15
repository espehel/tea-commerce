import { Orderline } from './orders';
import { ProductLine } from '~/states/cart/types';

export const toOrderline = (productLines: Array<ProductLine>): Array<Orderline> =>
  productLines.map((productLine) => ({
    productName: productLine.product.name,
    productRef: { _type: 'reference', _ref: productLine.id },
    _key: productLine.id,
  }));
