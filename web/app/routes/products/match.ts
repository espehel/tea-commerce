import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { getProductsByMatch, Product } from '../../../lib/sanity/simpleProductQuery';
import { getCachedValue, setCachedValue } from '../../../lib/utils/cache.server';

export const loader: LoaderFunction = async ({ request }) => {
  const search = new URL(request.url).searchParams.get('term');

  if (!search) {
    return json(null, 400);
  }
  const cachedProducts = getCachedValue<Array<Product>>(request.url);
  if (cachedProducts) {
    return json(cachedProducts);
  }
  const products = await getProductsByMatch(search);
  setCachedValue(request.url, products);
  return json(products);
};
