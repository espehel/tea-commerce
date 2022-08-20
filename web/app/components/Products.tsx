import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart';
import { FC } from 'react';
import { Product } from 'types/product';

interface Props {
  products: Array<Product>;
}

const Products: FC<Props> = ({ products }) => {
  const { addItem, removeItem } = useShoppingCart();
  return (
    <section>
      {products.map((product) => (
        <div key={product.sku}>
          <img src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p>
            {formatCurrencyString({
              value: product.price,
              currency: 'nok',
            })}
          </p>
          <button onClick={() => addItem(product)}>Add to cart</button>
          <button onClick={() => removeItem(product.sku)}>Remove</button>
        </div>
      ))}
    </section>
  );
};

export default Products;
