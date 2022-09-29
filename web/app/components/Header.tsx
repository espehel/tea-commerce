import React, { FC } from 'react';
import { Link, NavLink, useSearchParams } from '@remix-run/react';
import { HeartFilledIcon, HeartIcon, SearchIcon, TrolleyIcon } from '@sanity/icons';
import SearchForm from '~/components/SearchForm';
import { useCart } from '~/states/cart/CartProvider';
import Typography from '@mui/joy/Typography';
import { sumQuantity } from '../../lib/utils/cart';

const Header: FC = () => {
  const [searchParams] = useSearchParams();
  const { cart } = useCart();
  const categoryQueryParam = searchParams.get('category');
  const cartQuantity = cart.productLines.reduce(sumQuantity, 0) || null;

  return (
    <header className="grid grid-cols-3 items-center h-20 max-w-4xl m-auto">
      <h1 className="text-2xl bold justify-self-start">Tea Commerce</h1>
      <nav className="justify-self-center">
        <ul className="flex gap-4">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'underline' : undefined)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? 'underline' : undefined)}
            >
              Product
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'underline' : undefined)}>
              About
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-2 text-2xl justify-self-end">
        <SearchForm />
        <Link to="/products?category=favorites">
          {categoryQueryParam === 'favorites' ? <HeartFilledIcon color="red" /> : <HeartIcon />}
        </Link>
        <Link className="flex" to="/cart">
          <TrolleyIcon /> <Typography>{cartQuantity}</Typography>
        </Link>
      </div>
    </header>
  );
};

export default Header;
