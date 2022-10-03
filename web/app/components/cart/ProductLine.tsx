import React, { FC } from 'react';
import { ProductLine } from '~/states/cart/types';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@sanity/icons';
import { formatNok } from '../../../lib/utils/format';
import { useCart } from '~/states/cart/CartProvider';
import { Link } from '@remix-run/react';

interface Props {
  productLine: ProductLine;
}

const ProductLine: FC<Props> = ({ productLine }) => {
  const { removeProduct, updateProduct } = useCart();
  const { product, quantity, id } = productLine;

  const incrementProductLine = (increment: number) => {
    updateProduct({ ...productLine, quantity: quantity + increment });
  };

  return (
    <li key={id} className="grid grid-cols-12 py-2">
      <div className="col-span-1 flex">
        <ChevronLeftIcon
          className="text-2xl hover:cursor-pointer"
          role="button"
          aria-label="Decrease quantity"
          onClick={() => incrementProductLine(-1)}
        />
        <p>{quantity}</p>
        <ChevronRightIcon
          className="text-2xl hover:cursor-pointer"
          role="button"
          aria-label="Increase quantity"
          onClick={() => incrementProductLine(+1)}
        />
      </div>
      <Link className="col-span-8 hover:underline" to={`/products/${product.sku}`}>
        <p>{product.name}</p>
      </Link>
      <p className="col-span-1">{formatNok(product.price)}</p>
      <p className="col-span-1">{formatNok(product.price * quantity)}</p>
      <TrashIcon
        className="text-2xl hover:cursor-pointer justify-self-center"
        role="button"
        aria-label="Remove product"
        onClick={() => removeProduct(productLine)}
      />
    </li>
  );
};

export default ProductLine;
