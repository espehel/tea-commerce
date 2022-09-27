import { json, LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import Typography from '@mui/joy/Typography';
import React from 'react';
import ProductCard from '~/components/ProductCard';
import { getCategories } from '../../lib/sanity/categoryQuery';
import { getProducts } from '../../lib/sanity/simpleProductQuery';

export const loader = async ({ request, params }: LoaderArgs) => {
  const products = await getProducts();
  const categories = await getCategories();
  const populatedCategories = categories.filter((category) =>
    products.some((product) => product.categories.includes(category.title))
  );
  return json({
    products,
    categories: populatedCategories,
  });
};

function Categories() {
  const { products, categories } = useLoaderData<typeof loader>();

  const getProductsForCategory = (category: string) =>
    products.filter((product) => product.categories.includes(category)).slice(0, 3);

  return (
    <article className="max-w-4xl m-auto">
      <Typography level="display2" component="h2">
        Categories
      </Typography>
      {categories.map(({ title }) => (
        <section key={title} className="mt-8">
          <div className="flex justify-between">
            <Typography level="h3" component="h3">
              {title}
            </Typography>
            <Link className="outline-button" to={`/products?category=${title}`}>
              See all
            </Link>
          </div>
          <ul className="grid grid-cols-3 gap-4 mt-4">
            {getProductsForCategory(title).map((product) => (
              <li key={product.sku}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}

export default Categories;
