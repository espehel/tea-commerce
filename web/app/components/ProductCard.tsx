import React, { FC } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import { HeartFilledIcon, HeartIcon } from '@sanity/icons';
import { Product } from '../../lib/sanity/simpleProductQuery';
import { Link } from '@remix-run/react';
import { formatNok } from '../../lib/utils/format';
import { useFavorite } from '~/states/favorite/favorite-hooks';

interface Props {
  product: Product;
}

const ProductCard: FC<Props> = ({ product }) => {
  const { isFavorite, toggleFavourite } = useFavorite(product);

  return (
    <Card variant="outlined">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography level="h2" fontSize="md" sx={{ alignSelf: 'flex-start' }}>
          {product.name}
        </Typography>
        <Typography level="body2">{product.categories.join(', ')}</Typography>
      </Box>
      <IconButton
        aria-label="Favourite product"
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
        onClick={toggleFavourite}
      >
        {isFavorite ? <HeartFilledIcon color="red" /> : <HeartIcon />}
      </IconButton>

      <AspectRatio minHeight="120px" maxHeight="200px" sx={{ my: 2 }}>
        <img src={product.image} alt="" />
      </AspectRatio>
      <Box sx={{ display: 'flex' }}>
        <div>
          <Typography level="body3">Price:</Typography>
          <Typography fontSize="lg" fontWeight="lg">
            {formatNok(product.price)}
          </Typography>
        </div>
        <Link
          className="filled-button ml-auto"
          aria-label="Show product"
          to={`/products/${product.sku}`}
        >
          Show
        </Link>
      </Box>
    </Card>
  );
};

export default ProductCard;
