import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Library, X, AlignJustify, LogOut } from 'lucide-react';
import { UserAuth } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = UserAuth();
  const { resetSearch } = useSearch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsOpen(false);
      resetSearch(); 
    } catch (e) {
      console.log(e.message);
    }
  };

  // THIS FUNCTION HANDLES NAVIGATION FOR HOME AND COLLECTION
  const handleResetAndNav = () => {
     resetSearch();       // Wipe search memory
     setIsOpen(false);    // Close mobile menu
  };

  // Helper for links (About, Login) that don't need to reset search
  const closeMenu = () => setIsOpen(false);

  const linkClass = ({ isActive }) =>
    `font-medium transition-colors duration-300 ${isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-300 hover:text-blue-500'
    }`;

  return (
    <nav className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">

          {/* LEFT SIDE: Logo */}
          <NavLink to="/" onClick={handleResetAndNav} className="flex items-center gap-2 z-50">
            <Library className="text-blue-500" size={30} />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Book<span className="text-blue-500">Hunt</span>
            </span>
          </NavLink>

          {/* CENTER: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" onClick={handleResetAndNav} className={linkClass}>Home</NavLink>
            
            <NavLink to="/about" className={linkClass}>About</NavLink>
            
            <NavLink to="/collection" onClick={handleResetAndNav} className={linkClass}>My Collection</NavLink>
          </div>

          {/* RIGHT SIDE: Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user?.email ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">
                  Hello, <span className="text-white font-semibold">{user.displayName || user.email.split('@')[0]}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
                  Sign In
                </NavLink>
                <NavLink to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-lg shadow-blue-500/30">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-200 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <AlignJustify size={28} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4 pb-4 bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm`}>
          <div className="flex flex-col space-y-4">
            
            <NavLink to="/" className={linkClass} onClick={handleResetAndNav}>
                Home
            </NavLink>

            <NavLink to="/about" className={linkClass} onClick={closeMenu}>
                About
            </NavLink>

            <NavLink to="/collection" className={linkClass} onClick={handleResetAndNav}>
                My Collection
            </NavLink>

            <div className="border-t border-gray-700 my-2 pt-2">
              {user?.email ? (
                <div className="flex flex-col gap-4">
                  <span className="text-gray-400 text-sm">
                    Signed in as: <span className="text-white font-bold">{user.displayName || user.email}</span>
                  </span>
                  <button onClick={handleLogout} className="bg-red-500 text-white py-2 rounded-md">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <NavLink to="/login" className="text-center text-white py-2 border border-gray-600 rounded-md" onClick={closeMenu}>
                    Sign In
                  </NavLink>
                  <NavLink to="/signup" className="text-center bg-blue-600 text-white py-2 rounded-md" onClick={closeMenu}>
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;