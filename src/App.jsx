import React, { useRef, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import BookDetails from './pages/BookDetails.jsx';
import { gsap } from 'gsap';

const App = () => {
  const location = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.set(contentRef.current, { opacity: 0, y: -20 });
      
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    }
  }, [location.pathname]);

  return (
    <div className="bg-gray-900 min-h-screen">
      <div ref={contentRef}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/book/:bookId' element={<BookDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default App