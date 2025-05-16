import React, { useState } from "react";
import { Link } from "react-router-dom";
import Auth from "./Auth";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const navigate = useNavigate();

  const {user, logout} = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div className="bg-inherit  top-0 left-0 w-full z-50">
      <div className="border-b-8 rounded-full border-black shadow-2xl shadow-zinc-700 text-gray-200 m-6 relative">
        <nav className="lg:p-5 sm:p-3 md:p-4 flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-pretty font-semibold text-xl">OPINIO</h1>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex flex-grow justify-center space-x-10 text-center">
            <Link to='/'><li className="hover:text-gray-400 cursor-pointer">Home</li></Link>
            <Link to='/about'><li className="hover:text-gray-400 cursor-pointer">About</li></Link>
            <Link to='/events'><li className="hover:text-gray-400 cursor-pointer">Events</li></Link>
            <Link to='/contact-us'><li className="hover:text-gray-400 cursor-pointer">Contact Us</li></Link>

            {user && (
              <Link to='/profile'>
                <li className="hover:text-gray-400 cursor-pointer">Profile</li>
              </Link>
            )}

            {user ? (
              <li className="hover:text-gray-400 cursor-pointer">
                <button onClick={handleLogout} >Logout</button>
              </li>
            ) : (
              <li className="hover:text-gray-400 cursor-pointer">
                <button onClick={() => setIsAuthOpen(true)}>Signup/Login</button>
              </li>
            )}
          </ul>


          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
          </nav>


        {/* Mobile Menu */}
        {isOpen && (
          <motion.ul 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden flex flex-col items-center space-y-4 bg-black text-white p-6 rounded shadow-md absolute top-full left-0 w-full z-40"
          >
            {/* <button 
              onClick={() => setIsOpen(false)} 
              className="self-end text-xl text-gray-400 hover:text-white mb-2"
            >
              ❌
            </button> */}

            <li className="w-full text-center hover:text-gray-300">
              <Link to='/' onClick={() => setIsOpen(false)}>Home</Link>
            </li>
            <li className="w-full text-center hover:text-gray-300">
              <Link to='/about' onClick={() => setIsOpen(false)}>About</Link>
            </li>
            <li className="w-full text-center hover:text-gray-300">
              <Link to='/events' onClick={() => setIsOpen(false)}>Events</Link>
            </li>
            <li className="w-full text-center hover:text-gray-300">
              <Link to='/contact-us' onClick={() => setIsOpen(false)}>Contact Us</Link>
            </li>

            {user && (
              <li className="w-full text-center hover:text-gray-300">
                <Link to='/profile' onClick={() => setIsOpen(false)}>Profile</Link>
              </li>
            )}

            {user ? (
              <li className="w-full text-center">
                <button
                  onClick={handleLogout}
                  className="w-1/3 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="w-full text-center">
                <button
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  Signup / Login
                </button>
              </li>
            )}
          </motion.ul>
        )}

      </div>

      {isAuthOpen && (
        <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-zinc-900 text-black p-6 rounded-xl relative w-[90%] max-w-md">
            <button className="absolute top-2 right-2  text-gray-700" onClick={() => setIsAuthOpen(false)}>❌</button>
            <Auth setIsOpen={setIsAuthOpen} />
          </div>
        </motion.div>
      )}

    </div>
  );
}

export default Navbar;
