import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";

const Favorites = () => {
    const [books, setBooks] = useState([]);
    const { user } = UserAuth();

    // 1. Fetch Books from Database (Real-time listener)
    useEffect(() => {
        onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
            setBooks(doc.data()?.savedBooks || []);
        });
    }, [user?.email]);

    // 2. Remove Book Function
    const bookRef = doc(db, "users", `${user?.email}`);

    const deleteBook = async (passedID) => {
        try {
            const result = books.filter((item) => item.id === passedID);
            await updateDoc(bookRef, {
                savedBooks: result, // We could use arrayRemove, but filtering is often safer for complex objects
            });
            // Actually, arrayRemove requires the EXACT object reference.
            // A safer way for lists of objects is to rewrite the array without the item:
            const newBooks = books.filter((item) => item.id !== passedID);
            await updateDoc(bookRef, {
                savedBooks: newBooks,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen p-8 text-white">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/"
                        className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold">My Favorites</h1>
                </div>

                {/* Empty State */}
                {books.length === 0 ? (
                    <div className="text-center mt-20 text-gray-400">
                        <h2 className="text-xl">You haven't saved any books yet.</h2>
                        <Link to="/" className="text-blue-500 hover:underline mt-4 block">
                            Go back and find some!
                        </Link>
                    </div>
                ) : (
                    /* Grid Layout */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="relative group bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:-translate-y-1 transition-all duration-300"
                            >
                                <Link to={`/book/${book.id}`}>
                                    <img
                                        src={book.img}
                                        alt={book.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold truncate">{book.title}</h3>
                                        <p className="text-sm text-gray-400 truncate">
                                            {book.author}
                                        </p>
                                    </div>
                                </Link>

                                {/* DELETE BUTTON (X) */}
                                <div
                                    onClick={() => deleteBook(book.id)}
                                    className="absolute top-2 right-2 cursor-pointer bg-black/50 p-1 rounded-full hover:bg-red-600 transition-colors z-20"
                                >
                                    <X size={20} className="text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
