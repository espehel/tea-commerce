import React, { FC } from 'react';
import { Link } from '@remix-run/react';
import { Category } from '../../lib/sanity/categoryQuery';
import { Card, Text } from '@sanity/ui';
import { Button } from '@mui/joy';

interface Props {
  categories: Array<Category>;
}

const HomeCategories: FC<Props> = ({ categories }) => {
  return (
    <section className="mt-8">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-bold">Shop by categories</h2>
          <p className="mt-4">Add our new arrivals to your weekly lineup</p>
        </div>
        <Link className="outline-button self-start" to="/categories">
          See all
        </Link>
      </div>
      <ul className="grid grid-cols-4 gap-4 mt-4">
        {categories.slice(0, 8).map((category) => (
          <li key={category.title}>
            <Link to="/">
              <Card padding={[4]} radius={[4]} tone="positive">
                <Text align="center">{category.title}</Text>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeCategories;
