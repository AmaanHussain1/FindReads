import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar/NavBar';
import Loader from '../components/Loader/Loader';
import { ArrowLeft, ExternalLink, Check } from 'lucide-react';

// Import Firebase & Context
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { arrayUnion, doc, updateDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { useNotification } from '../context/NotificationContext';

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false); // Stores if book is ALREADY in DB

  const { user } = UserAuth();
  const { showNotification } = useNotification();

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  // FETCH BOOK DETAILS (Google API)
  useEffect(() => {
    if (!API_KEY) {
      setError("API Key is missing. Please check your .env file.");
      setLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`);
        setBook(response.data);
      } catch (err) {
        setError('Could not fetch book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, API_KEY]);

  // CHECK IF BOOK IS ALREADY SAVED (Firebase)
  useEffect(() => {
    if (user?.email && bookId) {
      // Listen to the user's document in real-time
      const unsubscribe = onSnapshot(doc(db, 'users', `${user?.email}`), (docSnapshot) => {
        if (docSnapshot.exists()) {
          const savedBooks = docSnapshot.data()?.savedBooks || [];
          // Check if ANY book in the array has the same ID as the current book
          const isAlreadySaved = savedBooks.some((item) => item.id === bookId);
          setSaved(isAlreadySaved);
        }
      });
      return () => unsubscribe();
    }
  }, [user?.email, bookId]);

  // SAVE BOOK FUNCTION
  const saveBook = async () => {
    if (user?.email) {
      // Double check to prevent duplicates if user clicks fast
      if (saved) {
        showNotification('You have already saved this book!', 'info');
        return;
      }

      const userRef = doc(db, 'users', `${user?.email}`);
      
      const bookData = {
        id: book.id,
        title: book.volumeInfo.title,
        img: book.volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/128x192/1f2937/ffffff?text=No+Cover',
        author: book.volumeInfo.authors?.[0] || 'Unknown Author'
      };

      try {
        // CHANGED FROM updateDoc TO setDoc WITH MERGE
        // This will create the user document if it doesn't exist yet!
        await setDoc(userRef, {
          savedBooks: arrayUnion(bookData)
        }, { merge: true });
        
        showNotification('Added to your collection!', 'success');
      } catch (error) {
        console.log(error);
        showNotification('Error saving book.', 'error');
      }
    } else {
      showNotification('Please login to save books.', 'error');
    }
  };


  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-10 text-center">
          <p className="text-red-500 text-xl">{error}</p>
          <Link to="/" className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (!book) return null;

  const { volumeInfo } = book;
  const title = volumeInfo.title;
  const authors = volumeInfo.authors || ['Unknown Author'];
  const publisher = volumeInfo.publisher || 'N/A';
  const publishedDate = volumeInfo.publishedDate || 'N/A';
  const description = volumeInfo.description || 'No description available.';
  const thumbnail = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || 'https://placehold.co/128x192/1f2937/ffffff?text=No+Cover';
  const previewLink = volumeInfo.previewLink;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        
        <Link to="/" className="mb-8 inline-flex items-center text-blue-400 hover:text-blue-500 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search Results
        </Link>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          <div className="md:w-1/3 flex-shrink-0">
            <img 
              src={thumbnail} 
              alt={`Cover of ${title}`} 
              className="rounded-lg shadow-2xl w-full max-w-sm mx-auto md:mx-0"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x192/1f2937/ffffff?text=No+Cover'; }}
            />
          </div>

          <div className="md:w-2/3">
            <h1 className="text-4xl font-extrabold mb-2">{title}</h1>
            <p className="text-xl text-gray-400 mb-4">by {authors.join(', ')}</p>
            
            <div className="flex items-center space-x-4 mb-6 text-sm text-gray-300">
              <span><strong>Publisher:</strong> {publisher}</span>
              <span><strong>Published:</strong> {publishedDate}</span>
            </div>
            
            <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: description }} />
            
            <div className="mt-8 flex flex-wrap gap-4">
              
              {/* SAVE BUTTON */}
              <button
                onClick={saveBook}
                disabled={saved} // DISABLE BUTTON IF ALREADY SAVED
                className={`inline-flex items-center font-bold py-3 px-6 rounded-lg transition-all duration-300 transform ${
                  saved 
                    ? 'bg-green-600/20 text-green-400 border border-green-500 cursor-not-allowed' 
                    : 'bg-white text-gray-900 hover:bg-gray-200 active:scale-95'
                }`}
              >
                {saved && <Check className="w-5 h-5 mr-2" />} 
                {saved ? 'Saved to Collection' : 'Add to Collection'}
              </button>

              {previewLink && (
                <a 
                  href={previewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Preview Book
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;