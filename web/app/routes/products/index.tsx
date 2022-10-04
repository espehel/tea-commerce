import React, { FC } from 'react';
import { json, LoaderArgs } from '@remix-run/node';
import {
  getProducts,
  getProductsByCategory,
  getProductsByMatch,
  Product,
} from '../../../lib/sanity/simpleProductQuery';
import { Link, useLoaderData, useSearchParams, useSubmit } from '@remix-run/react';
import Typography from '@mui/joy/Typography';
import ProductCard from '~/components/ProductCard';
import { getCategories } from '../../../lib/sanity/categoryQuery';
import { useFavoritedProducts } from '~/states/favorite/favorite-hooks';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';

export const loader = async ({ request }: LoaderArgs) => {
  const category = new URL(request.url).searchParams.get('category');
  const search = new URL(request.url).searchParams.get('search');
  const categories = await getCategories();

  let products: Array<Product>;
  if (search) {
    products = await getProductsByMatch(search);
  } else if (category && categories.some(({ title }) => title === category)) {
    products = await getProductsByCategory(category);
  } else {
    products = await getProducts();
  }

  return json({
    products,
  });
};

const ProductsIndex: FC = () => {
  const { products } = useLoaderData<typeof loader>();
  const { favoritedProducts, refreshFavorites } = useFavoritedProducts(products);

  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const filteredProducts = category === 'favorites' ? favoritedProducts : products;

  const headerText =
    category === 'favorites'
      ? 'Your favorite products'
      : category
      ? `${category} products`
      : search
      ? `Products matching "${search}"`
      : 'All products';

  return (
    <article className="max-w-4xl m-auto">
      <Typography level="h1" component="h2">
        {headerText}
      </Typography>
      {filteredProducts.length > 0 ? (
        <ul className="grid grid-cols-3 gap-4 mt-8">
          {filteredProducts.map((product) => (
            <ProductCard product={product} key={product.sku} onFavoriteToggled={refreshFavorites} />
          ))}
        </ul>
      ) : (
        <section>
          <Typography level="h3">No products found</Typography>
          <Link className="outline-button block mt-4 w-fit" to="/products">
            Show all products
          </Link>
        </section>
      )}
    </article>
  );
};

export default ProductsIndex;
