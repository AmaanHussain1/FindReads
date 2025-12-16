import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { UserAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firebase';
import { arrayUnion, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useNotification } from '../../context/NotificationContext';


const BookCard = ({ book }) => {
  const { user } = UserAuth();
  const { showNotification } = useNotification();
  const [saved, setSaved] = useState(false);

  // Safe data extraction
  const title = book.volumeInfo.title || 'No Title Available';
  const author = book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Unknown Author';
  const thumbnail = book.volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/128x192/1f2937/ffffff?text=No+Cover';

  const saveBook = async (e) => {
    e.preventDefault(); // Prevent Link navigation when clicking the heart

    if (user?.email) {
      // Reference the specific user's document in the database
      const userRef = doc(db, 'users', `${user.email}`);
      
      setSaved(true);

      try {
        await setDoc(userRef, {
            savedBooks: arrayUnion({
              id: book.id,
              title: title,
              img: thumbnail,
              author: author
            })
        }, { merge: true });
        
        setSaved(true);
        showNotification("Book added to favorites!", "success");
      } catch (error) {
        showNotification("Error saving book.", "error");
      }
    } else {
      showNotification("Please login to save books!", "error");
    }
  };

  return (
    <div className="relative group">
      <Link to={`/book/${book.id}`} key={book.id} className="block bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
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

      {/* HEART BUTTON */}
      <div 
        onClick={saveBook}
        className="absolute top-2 right-2 cursor-pointer bg-gray-900/50 p-2 rounded-full hover:bg-gray-900 transition-colors z-10"
      >
        {saved ? (
           <Heart className="text-red-500 fill-current" size={20} />
        ) : (
           <Heart className="text-gray-300 hover:text-red-500" size={20} />
        )}
      </div>
    </div>
  );
};

export default BookCard;