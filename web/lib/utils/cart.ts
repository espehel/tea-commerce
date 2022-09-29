import { ProductLine } from '~/states/cart/types';

export const sumQuantity = (accumulated: number, productLine: ProductLine) =>
  accumulated + productLine.quantity;
