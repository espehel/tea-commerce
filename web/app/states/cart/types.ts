import { Product } from '../../../lib/sanity/simpleProductQuery';

export interface ProductLine {
  id: string;
  product: Product;
  quantity: number;
}

export const isProduct = (value: unknown): value is Product => {
  const product = value as Product;
  return Boolean(product && product.id && product.price && product.name);
};

export const isProductLine = (value: unknown): value is ProductLine => {
  const productLine = value as ProductLine;
  return Boolean(
    productLine && productLine.id && isProduct(productLine.product) && productLine.quantity
  );
};
