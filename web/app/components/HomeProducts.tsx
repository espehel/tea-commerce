import React, { FC } from 'react';
import { Link } from '@remix-run/react';
import { Product } from '../../lib/sanity/simpleProductQuery';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';

interface Props {
  products: Array<Product>;
}

const HomeProducts: FC<Props> = ({ products }) => {
  return (
    <section className="mt-8">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-bold">Popular products</h2>
          <p className="mt-4">Hottest products right now</p>
        </div>
        <Link className="outline-button self-start" to="/products">
          See all
        </Link>
      </div>
      <ul className="flex gap-4 mt-4">
        {products.slice(0, 4).map((product) => (
          <li key={product.sku}>
            <Link to={`products/${product.sku}`}>
              <Card sx={{ minHeight: 200, minWidth: 200 }}>
                <CardCover>
                  <img src={product.image} alt="" />
                </CardCover>
                <CardCover
                  sx={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                  }}
                />
                <CardContent sx={{ justifyContent: 'flex-end' }}>
                  <Typography level="h2" fontSize="lg" textColor="#fff" mb={1}>
                    {product.name}
                  </Typography>
                  <Typography textColor="neutral.300">{product.price},-</Typography>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeProducts;
