import React, { useState, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import SearchBar from '../components/SearchBar.jsx';
import BookCard from '../components/BookCard.jsx';
import Loader from '../components/Loader.jsx';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  const fetchBooks = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setBooks([]);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${API_KEY}&maxResults=20`
      );
      setBooks(response.data.items || []);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, API_KEY]);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      fetchBooks();
    }
  };

  return (
    <div 
      className="bg-cover bg-center bg-fixed" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm min-h-screen transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Header />
          <div className="mt-8">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
            />
          </div>

          <div className="mt-12">
            {loading && <Loader />}
            {error && <p className="text-center text-red-500 dark:text-red-400 text-lg">{error}</p>}
            {!loading && !error && books.length === 0 && searchTerm && (
              <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
                No books found for your query.
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;