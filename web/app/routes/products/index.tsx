import { json, LoaderArgs } from '@remix-run/node';
import { getProducts } from '../../../lib/sanity/simpleProductQuery';
import { useLoaderData } from '@remix-run/react';
import Typography from '@mui/joy/Typography';
import React from 'react';
import ProductCard from '~/components/ProductCard';

export const loader = async ({ request, params }: LoaderArgs) => {
  const products = await getProducts();
  return json({
    products,
  });
};

function ProductsIndex() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <article className="max-w-4xl m-auto">
      <Typography level="display2" component="h2">
        Products
      </Typography>
      <ul className="grid grid-cols-3 gap-4 mt-8">
        {products.map((product) => (
          <ProductCard product={product} key={product.sku} />
        ))}
      </ul>
    </article>
  );
}

export default ProductsIndex;
