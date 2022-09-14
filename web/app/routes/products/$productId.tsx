import React, { FC, useState } from 'react';
import Typography from '@mui/joy/Typography';
import { json, LoaderArgs } from '@remix-run/node';
import { getProductBySKU } from '../../../lib/sanity/simpleProductQuery';
import { useLoaderData } from '@remix-run/react';
import AspectRatio from '@mui/joy/AspectRatio';
import { useShoppingCart } from 'use-shopping-cart';
import { Button, TextField } from '@mui/joy';

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
  const { addItem } = useShoppingCart();
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
            {product.price},-
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
            <Button onClick={() => addItem(product, { count: quantity })}>Add to cart</Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductRoute;
