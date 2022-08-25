import React, { FC } from 'react';
import { NavLink } from '@remix-run/react';
import { HeartIcon, SearchIcon, TrolleyIcon } from '@sanity/icons';

const Header: FC = () => {
  return (
    <header className="flex justify-between items-center h-20 max-w-4xl m-auto">
      <h1 className="text-2xl bold">Tea Commerce</h1>
      <nav>
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
      <div className="flex gap-2 text-2xl">
        <SearchIcon />
        <HeartIcon />
        <TrolleyIcon />
      </div>
    </header>
  );
};

export default Header;
