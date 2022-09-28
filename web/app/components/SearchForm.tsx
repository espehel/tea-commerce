import React, { FC, useEffect, useState } from 'react';
import { SearchIcon } from '@sanity/icons';
import IconButton from '@mui/joy/IconButton';
import TextField from '@mui/joy/TextField';
import { Link, useFetcher } from '@remix-run/react';
import { Product } from '../../lib/sanity/simpleProductQuery';
import Typography from '@mui/joy/Typography';

interface Props {}

const SearchForm: FC<Props> = ({}) => {
  const { data, load } = useFetcher<Array<Product>>();
  const [showForm, setShowForm] = useState(false);
  const [results, setResults] = useState<Array<Product> | undefined>(data);

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    load(`/products/match?term=${event.target.value}`);
  };

  useEffect(() => {
    setResults(data);
  }, [data]);

  const handleFormClose = () => {
    setTimeout(() => {
      setResults(undefined);
      setShowForm(false);
    }, 100);
  };

  if (!showForm) {
    return <SearchIcon className="hover:cursor-pointer" onClick={() => setShowForm(true)} />;
  }

  return (
    <form className="relative" method="get" action="/products">
      <TextField
        name="search"
        placeholder="Search anything…"
        autoFocus
        onChange={handleTextFieldChange}
        onBlur={handleFormClose}
        endDecorator={
          <IconButton type="submit" variant="outlined">
            <SearchIcon />
          </IconButton>
        }
      />
      {results && results.length > 0 && (
        <section className="absolute bg-white w-full border border-solid rounded">
          <ul className="divide-y divide-solid px-4 py-2">
            {results.map((product) => (
              <li key={product.sku}>
                <Link to={`/products/${product.sku}`}>
                  <Typography>{product.name}</Typography>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </form>
  );
};

export default SearchForm;
