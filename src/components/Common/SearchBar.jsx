import { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search templates...', 
  debounceMs = 300 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  const debouncedSearch = useCallback((value) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, debounceMs);
  }, [onSearch, debounceMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative">
      <div className={`
        relative flex items-center transition-all duration-200
        ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}>
        <MagnifyingGlassIcon 
          className="absolute left-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            w-full pl-10 pr-10 py-2 
            bg-gray-800 text-white 
            rounded-lg border border-gray-700 
            placeholder-gray-400
            focus:outline-none focus:border-blue-500
            transition-colors duration-200
          "
          aria-label="Search"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="
              absolute right-3 
              p-0.5 rounded-full
              text-gray-400 hover:text-white
              hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white
              transition-colors duration-200
            "
            aria-label="Clear search"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
