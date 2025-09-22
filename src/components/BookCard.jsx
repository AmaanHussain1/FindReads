import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const title = book.volumeInfo.title || 'No Title Available';
  const author = book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Unknown Author';
  const thumbnail = book.volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/128x192/1f2937/ffffff?text=No+Cover';

  return (
    <Link to={`/book/${book.id}`} key={book.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <div className="relative">
        <img
          src={thumbnail}
          alt={`Cover of ${title}`}
          className="w-full lg:h-48 h-32 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x192/1f2937/ffffff?text=No+Cover'; }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold truncate text-white">{title}</h3>
        <p className="text-sm text-gray-400">{author}</p>
      </div>
    </Link>
  );
};

export default BookCard;