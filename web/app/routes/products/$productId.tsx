import React, { FC, useState } from 'react';
import Typography from '@mui/joy/Typography';
import { json, LoaderArgs } from '@remix-run/node';
import { getProductBySKU } from '../../../lib/sanity/simpleProductQuery';
import { useLoaderData } from '@remix-run/react';
import AspectRatio from '@mui/joy/AspectRatio';
import { TextField } from '@mui/joy';
import { useCart } from '~/states/cart/CartProvider';
import { formatNok } from '../../../lib/utils/format';

export const loader = async ({ request, params }: LoaderArgs) => {
  const product = await getProductBySKU(params['productId']);
  return json({
    product: product,
    ENV: {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  });
};

const ProductRoute: FC = ({}) => {
  const { addProduct } = useCart();
  const { product } = useLoaderData<typeof loader>();
  const [quantity, setQuantity] = useState(1);

  return (
    <article className="max-w-4xl m-auto text-center">
      <Typography level="display1" component="h2">
        {product.name}
      </Typography>
      <div className="grid grid-cols-2 gap-8 text-left mt-8">
        <AspectRatio>
          <img src={product.image} alt="" />
        </AspectRatio>
        <div>
          <Typography level="h5" component="p">
            {formatNok(product.price)}
          </Typography>
          <Typography level="h3">{product.name}</Typography>
          <Typography component="p">{product.description}</Typography>
          <div className="flex gap-4">
            <TextField
              placeholder="Quantity"
              type="number"
              defaultValue={quantity}
              onChange={(e) => setQuantity(parseInt(e.currentTarget.value))}
            />
            <button
              className="filled-button"
              onClick={() => addProduct({ id: product.id, product, quantity })}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductRoute;
