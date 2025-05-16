import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    endingAt: '',
    quantity: 1
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://opinio-backend-pyno.onrender.com/events', formData);
      if (response.data) {
        toast.success('Event created successfully');
        navigate('/events'); // Navigate to home page or events list
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pt-12">
      <div className="bg-zinc-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl text-white font-bold mb-6 text-center">Create Event</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className='w-full px-3 py-2 bg-zinc-700 rounded-md focus:outline-none text-white'
            >
              <option value="none">None</option>
              <option value="Cricket">Cricket</option>
              <option value="Youtube">Youtube</option>
              <option value="News">News</option>
              <option value="Gaming">Gaming</option>
              <option value="Chess">Chess</option>
              <option value="Crypto">Crypto</option>
            </select>
          </div>
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-200 mb-1">
              Question
            </label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-zinc-700 rounded-md focus:outline-none focus:ring-1 text-white"
              placeholder="Enter your event question"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 bg-zinc-700 rounded-md focus:outline-none text-white"
              placeholder="Enter event description"
            ></textarea>
          </div>

          <div>
            <label htmlFor="endingAt" className="block text-sm font-medium text-gray-200 mb-1">
              Event Ending Date
            </label>
            <input
              type="datetime-local"
              id="endingAt"
              name="endingAt"
              value={formData.endingAt}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-zinc-700 rounded-md focus:outline-none text-white"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-200 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 bg-zinc-700 rounded-md focus:outline-none text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-950 text-white py-2 px-4 rounded-md hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;