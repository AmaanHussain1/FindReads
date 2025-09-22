import React from 'react';
import Navbar from '../components/NavBar';

const About = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-6">
          About <span className='text-white'>FindReads</span>
        </h1>
        <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
          <p className="text-lg mb-4 text-gray-300">
            Welcome to FindReads, your personal gateway to the world of literature. This application was built to provide a simple, fast, and intuitive way to discover new books and authors.
          </p>
          <p className="text-lg mb-4 text-gray-300">
            Powered by the Google Books API, we offer access to a vast and diverse database of books. Whether you're searching for a classic novel, a new bestseller, or a textbook for your studies, FindReads is here to help you find it.
          </p>
          <p className="text-lg text-gray-300">
            This project was developed using modern web technologies including React, Vite for a blazing-fast development experience, and Tailwind CSS for a sleek, responsive design.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;