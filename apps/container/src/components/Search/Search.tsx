import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaSearch } from 'react-icons/fa';
import { UI_CONFIG } from '../../../../../shared/config';

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
      }
    }, UI_CONFIG.DEBOUNCE_DELAY);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query, onSearch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className='flex items-center bg-gray-100 px-2 rounded w-1/4'>
      <input
        type='text'
        placeholder='Search'
        value={query}
        onChange={handleChange}
        className='flex-1 border-none outline-none bg-transparent p-1'
      />
      <FaSearch className='ml-2 text-gray-500' />
    </div>
  );
};

export default Search;
