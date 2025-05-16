import React, { useState } from 'react'
import EventCard from '../components/EventCard'
import EventsList from '../components/EventsList'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/authContext';

const categories = ['All', 'Cricket', 'Youtube', 'News', 'Gaming', 'Chess', 'Crypto'];

function Events() {
  const navigate = useNavigate();
  const {user} = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCreateEvent = () => {
    if (!user) {
      toast.error('You must be logged in to create an event!');
      return;
    }
    navigate('/create-event');
  };

  return (
    <div className='bg-black min-h-screen '>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 '>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-white text-4xl font-bold'>All Events</h1>
          <button
            onClick={handleCreateEvent}
            className='bg-white text-black eehover:bg-gray-300 font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105'
          >
            Create Event
          </button>
        </div>
        <div className='mb-4 flex items-center gap-8'>
          <span className='text-gray-300 font-medium'>Categories:</span>
          <div className='flex gap-6 overflow-x-auto pb-2'>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1 rounded-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-zinc-900 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <hr className='border-gray-700 mb-6' />
        <EventsList selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}

export default Events