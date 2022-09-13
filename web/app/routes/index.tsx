import HomeBanner from '~/components/HomeBanner';
import HomeCategories from '~/components/HomeCategories';
import HomeProducts from '~/components/HomeProducts';
import { json, LoaderArgs } from '@remix-run/node';
import { getProducts } from '../../lib/sanity/simpleProductQuery';
import { useLoaderData } from '@remix-run/react';
import { getCategories } from '../../lib/sanity/categoryQuery';

export const loader = async ({ request, params }: LoaderArgs) => {
  const categories = await getCategories();
  const products = await getProducts();
  return json({
    categories,
    products,
    ENV: {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  });
};

function Index() {
  const { categories, products } = useLoaderData<typeof loader>();

  return (
    <article>
      <HomeBanner />
      <div className="max-w-4xl m-auto">
        <HomeCategories categories={categories} />
        <HomeProducts products={products} />
      </div>
    </article>
  );
}

export default Index;
