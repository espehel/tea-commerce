import { json, LoaderArgs } from '@remix-run/node';
import {
  getProducts,
  getProductsByCategory,
  Product,
} from '../../../lib/sanity/simpleProductQuery';
import { useLoaderData, useSearchParams, useSubmit } from '@remix-run/react';
import Typography from '@mui/joy/Typography';
import React from 'react';
import ProductCard from '~/components/ProductCard';
import { getCategories } from '../../../lib/sanity/categoryQuery';
import { useFavoritedProducts } from '~/states/favorite/favorite-hooks';

export const loader = async ({ request }: LoaderArgs) => {
  const category = new URL(request.url).searchParams.get('category');
  const categories = await getCategories();

  let products: Array<Product>;
  if (category && categories.some(({ title }) => title === category)) {
    products = await getProductsByCategory(category);
  } else {
    products = await getProducts();
  }

  return json({
    products,
  });
};

function ProductsIndex() {
  const { products } = useLoaderData<typeof loader>();
  const { favoritedProducts, refreshFavorites } = useFavoritedProducts(products);

  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const filteredProducts = category === 'favorites' ? favoritedProducts : products;

  return (
    <article className="max-w-4xl m-auto">
      <Typography level="display2" component="h2">
        Products
      </Typography>
      <ul className="grid grid-cols-3 gap-4 mt-8">
        {filteredProducts.map((product) => (
          <ProductCard product={product} key={product.sku} onFavoriteToggled={refreshFavorites} />
        ))}
      </ul>
    </article>
  );
}

export default ProductsIndex;
