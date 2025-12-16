import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Trash2, ExternalLink } from 'lucide-react';

const Favorites = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null); // Stores the ID of the book we might delete

  const { user } = UserAuth();

  // Fetch Books logic
  useEffect(() => {
    if (user?.email) {
      const unsubscribe = onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
        setBooks(doc.data()?.savedBooks || []);
      });
      return () => unsubscribe();
    }
  }, [user?.email]);

  // Trigger Confirmation
  const confirmDelete = (id) => {
    setBookToDelete(id);
    setShowModal(true);
  };

  // Actual Delete Logic (Runs only if user clicks YES)
  const handleDelete = async () => {
    try {
      const bookRef = doc(db, 'users', `${user?.email}`);
      const newBooks = books.filter((item) => item.id !== bookToDelete);
      await updateDoc(bookRef, { savedBooks: newBooks });

      // Close modal after deleting
      setShowModal(false);
      setBookToDelete(null);
    } catch (error) { console.log(error); }
  };

  // Cancel Delete
  const cancelDelete = () => {
    setShowModal(false);
    setBookToDelete(null);
  };

  // --- IF USER IS NOT LOGGED IN ---
  if (!user) {
    return (
      <div className="w-full h-screen bg-gray-900 relative flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-20 blur-sm"
            alt="Background"
          />
        </div>

        <div className="relative bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full text-center">
          <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-blue-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-gray-400 mb-8">
            Join <span className="text-blue-500 font-semibold">BookHunt</span> to create your own personal library and save your favorite books.
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/login" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all">
              Sign In
            </Link>
            <Link to="/signup" className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-bold py-3 rounded-lg transition-all">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN FAVORITES UI ---
  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-8 text-white">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to='/' className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">My Collection</h1>
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="text-center mt-20 text-gray-400">
            <h2 className="text-xl">Your collection is empty.</h2>
            <Link to="/" className="text-blue-500 hover:underline mt-4 block">
              Go find some books to add!
            </Link>
          </div>
        ) : (

          /* List Layout Cards */
          <div className="flex flex-col gap-4">
            {books.map((book) => (
              <div key={book.id} className="flex flex-col sm:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-300">

                {/* Left: Image */}
                <Link to={`/book/${book.id}`} className="sm:w-32 w-full h-48 sm:h-auto shrink-0">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Right: Content & Actions */}
                <div className="p-5 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link to={`/book/${book.id}`}>
                        <h3 className="text-xl font-bold text-white hover:text-blue-400 transition mb-1">{book.title}</h3>
                      </Link>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{book.author}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-4 sm:mt-0">
                    <Link
                      to={`/book/${book.id}`}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex items-center gap-2"
                    >
                      <ExternalLink size={16} /> View Details
                    </Link>

                    <button
                      onClick={() => confirmDelete(book.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600/80 hover:bg-red-600 rounded-md transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- CONFIRMATION BEFORE REMOVE --- */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
              <h3 className="text-xl font-bold text-white mb-2">Delete Book?</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to remove this book from your collection? This action cannot be undone.</p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-300 hover:text-white font-medium hover:bg-gray-700 rounded-lg transition-colors"
                >
                  No, Keep it
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-500/20"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Favorites;