import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Library, X, AlignJustify } from 'lucide-react'; // Changed icon to Library
import { gsap } from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    gsap.set(navbarRef.current, { y: -100, opacity: 0 });
    gsap.to(navbarRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
    });
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav ref={navbarRef} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="flex items-center gap-2">
            <Library className="text-blue-500" size={30} /> 
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              Find<span className="text-blue-500">Reads</span>
            </span>
          </NavLink>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={20} /> : <AlignJustify size={20} />}
            </button>
          </div>
        </div>
        <div className={`md:flex items-center ${isOpen ? 'block mt-4 md:mt-0' : 'hidden'}`}>
          <div className="flex flex-col md:flex-row md:ml-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `my-2 md:my-0 md:mx-4 font-medium hover:text-blue-500 transition-colors duration-300 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}`
              }
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `my-2 md:my-0 md:mx-4 font-medium hover:text-blue-500 transition-colors duration-300 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}`
              }
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;