import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { getProductsByMatch } from '../../../lib/sanity/simpleProductQuery';

export const loader: LoaderFunction = async ({ request }) => {
  const search = new URL(request.url).searchParams.get('term');

  if (search) {
    const products = await getProductsByMatch(search);
    return json(products);
  }
  return json(null, 400);
};
