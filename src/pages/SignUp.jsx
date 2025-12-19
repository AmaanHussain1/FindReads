import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const { createUser } = UserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUser(email, password, username);
      navigate('/');
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <img
        className="hidden sm:block absolute inset-0 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop"
        alt="Background"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs"></div>

      <div className="relative w-full h-full flex items-center justify-center px-4 z-50">
        <div className="max-w-[450px] w-full bg-black/75 text-white rounded-lg shadow-2xl border border-gray-800 p-8">
          <div className="max-w-[320px] mx-auto">
            <h1 className="text-3xl font-bold mb-8">Sign Up</h1>

            {error && <p className="p-3 bg-red-500/50 my-2 rounded">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col">

              {/* NEW USERNAME INPUT */}
              <input
                onChange={(e) => setUsername(e.target.value)}
                className="p-3 my-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                type="text"
                placeholder="Username"
                required
              />

              <input
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 my-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 my-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                required
              />
              <button className="bg-blue-600 py-3 my-6 rounded font-bold hover:bg-blue-700 transition duration-300">
                Sign Up
              </button>

              <div className="flex justify-between items-center text-sm text-gray-400">
                <p className="flex items-center"><input className="mr-2" type="checkbox" /> Remember me</p>
                <p className="cursor-pointer hover:text-white">Need Help?</p>
              </div>

              <p className="mt-8">
                <span className="text-gray-400">Already subscribed to BookHunt?</span>{' '}
                <Link to='/login' className="text-blue-500 hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;