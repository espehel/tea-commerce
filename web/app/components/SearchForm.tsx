import React, { FC, useState } from 'react';
import { SearchIcon } from '@sanity/icons';
import IconButton from '@mui/joy/IconButton';
import TextField from '@mui/joy/TextField';

interface Props {}

const SearchForm: FC<Props> = ({}) => {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return <SearchIcon className="hover:cursor-pointer" onClick={() => setShowForm(true)} />;
  }

  return (
    <form method="get" action="/products">
      <TextField
        name="search"
        placeholder="Search anything…"
        autoFocus
        onBlur={() => setShowForm(false)}
        endDecorator={
          <IconButton type="submit" variant="outlined">
            <SearchIcon />
          </IconButton>
        }
      />
    </form>
  );
};

export default SearchForm;
