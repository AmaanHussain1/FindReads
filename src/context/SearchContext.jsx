import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  // This state lives outside the pages, so it doesn't reset.
  const [searchResults, setSearchResults] = useState([]);
  const [lastQuery, setLastQuery] = useState(''); 

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults, lastQuery, setLastQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};