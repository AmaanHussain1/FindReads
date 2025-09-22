import React from 'react';

const Header = () => {
  return (
    <header className="text-center py-6 lg:py-12">
      <h1 className="lg:text-5xl text-3xl font-bold text-white mb-3">
        Find Your Next Read
      </h1>
      <p className="text-sm lg:text-xl text-gray-400 max-w-2xl mx-auto">
        Explore a vast library of books. Search by title, author, or keyword to discover your next adventure.
      </p>
    </header>
  );
};

export default Header;