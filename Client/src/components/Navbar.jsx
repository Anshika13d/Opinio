import React, { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='bg-inherit'>
      <div className="border-b-8 rounded-full border-black shadow-2xl shadow-zinc-700 text-gray-200 m-6">
        <nav className="lg:p-5 sm:p-3 md:p-4 flex items-center justify-between px-4 lg:px-10">
          
          <h1 className='text-pretty font-semibold text-lg'>OPINIO</h1>

          <ul className="hidden lg:flex flex-grow justify-center space-x-10 text-center">
            <li className="hover:text-gray-400">Home</li>
            <li className="hover:text-gray-400">About</li>
            <li className="hover:text-gray-400">Events</li>
            <li className="hover:text-gray-400">Contact Us</li>
            <li className="hover:text-gray-400">Signup/Login</li>
          </ul>

          <div className="lg:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </nav>

        {isOpen && (
          <ul className="lg:hidden flex flex-col items-center space-y-4 py-4 bg-black">
            <li className="hover:text-gray-400">Home</li>
            <li className="hover:text-gray-400">About</li>
            <li className="hover:text-gray-400">Events</li>
            <li className="hover:text-gray-400">Contact Us</li>
            <li className="hover:text-gray-400">Profile</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Navbar;
