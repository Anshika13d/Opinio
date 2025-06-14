import React, { useState, useEffect } from 'react';
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
  
  // Get current date and time in ISO format
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special validation for endingAt
    if (name === 'endingAt') {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      
      // Add 5 minutes to current date to allow for near-future times
      const minimumDate = new Date(currentDate.getTime() + 5 * 60000);
      
      if (selectedDate <= minimumDate) {
        toast.error('Please select a time at least 5 minutes in the future');
        return;
      }
    }
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    const endingDate = new Date(formData.endingAt);
    const currentDate = new Date();
    const minimumDate = new Date(currentDate.getTime() + 5 * 60000);
    
    if (endingDate <= minimumDate) {
      setError('Event ending time must be at least 5 minutes in the future');
      return;
    }
    
    try {
      // Convert the date to UTC before sending to server
      const utcEndingAt = new Date(formData.endingAt).toISOString();
      const eventData = {
        ...formData,
        endingAt: utcEndingAt
      };
      
      const response = await axios.post('https://opinio-backend-pyno.onrender.com/events', eventData, { withCredentials: true });
      if (response.data) {
        toast.success('Event created successfully');
        navigate('/events');
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
              min={getCurrentDateTime()} // Set minimum date to current date and time
              required
              className="w-full px-3 py-2 bg-zinc-700 rounded-md focus:outline-none text-white"
            />
            <p className="text-sm text-gray-400 mt-1">
              Select a future date and time for the event to end
            </p>
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
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;