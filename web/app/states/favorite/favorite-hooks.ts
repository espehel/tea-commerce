import { useCallback, useEffect, useState } from 'react';
import { getItemFromLocalStorage, setItemToLocalStorage } from '../../../lib/utils/localstorage';
import { Product } from '../../../lib/sanity/simpleProductQuery';

export const useFavorite = (product: Product) => {
  const [isFavorite, setFavorite] = useState(false);

  useEffect(() => {
    const favorites = getItemFromLocalStorage<Array<string>>('tea-commerce.favorites') || [];
    setFavorite(favorites.includes(product.sku));
  }, [product]);

  const toggleFavorite = useCallback(() => {
    const favorites = getItemFromLocalStorage<Array<string>>('tea-commerce.favorites') || [];
    if (favorites.includes(product.sku)) {
      setItemToLocalStorage(
        'tea-commerce.favorites',
        favorites.filter((sku) => sku !== product.sku)
      );
      setFavorite(false);
    } else {
      setItemToLocalStorage('tea-commerce.favorites', favorites.concat(product.sku));
      setFavorite(true);
    }
  }, []);
  return { isFavorite, toggleFavorite };
};

export const useFavoritedProducts = (products: Array<Product>) => {
  const [favoritedProducts, setFavoritedProducts] = useState(products);

  useEffect(() => {
    const favorites = getItemFromLocalStorage<Array<string>>('tea-commerce.favorites') || [];
    setFavoritedProducts(products.filter((product) => favorites.includes(product.sku)));
  }, [products]);

  const refreshFavorites = useCallback(() => {
    const favorites = getItemFromLocalStorage<Array<string>>('tea-commerce.favorites') || [];
    setFavoritedProducts(products.filter((product) => favorites.includes(product.sku)));
  }, []);

  return { favoritedProducts, refreshFavorites };
};
