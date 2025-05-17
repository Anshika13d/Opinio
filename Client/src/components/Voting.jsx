import { useState, useEffect } from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import RechargeModal from './RechargeModal';
import socket from '../utils/socket';

export default function Voting({ eventId, question, initialYesPrice = 3.0, initialNoPrice = 7.0, userBalance = 3, selectedOptionHere, onVoteComplete, isUpdate = false }) {
  // State management
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(selectedOptionHere || 'yes');
  const [yesPrice, setYesPrice] = useState(initialYesPrice);
  const [noPrice, setNoPrice] = useState(initialNoPrice);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [balance, setBalance] = useState(userBalance);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  
  // Calculate costs and returns
  const selectedPrice = selectedOption === 'yes' ? yesPrice : noPrice;
  const costAmount = selectedPrice * quantity;
  const returnAmount = 10 * quantity; // Fixed return of ₹10 per quantity
  const insufficientFunds = balance < costAmount;

  const {user} = useAuth();
  // Update balance based on user context
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get('/auth/me');
        setBalance(response.data.balance);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };

    if (user) {
      fetchBalance();
    }
  }, [user]);

  // Handle quantity increase/decrease
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Handle vote submission
  const handleVote = async () => {
    if (!user) {
      toast.error('You must be logged in to vote!');
      return;
    }

    if (insufficientFunds) {
      setError('Insufficient balance');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await api.patch(`/events/${eventId}/vote`, {
        vote: selectedOption,
        quantity: quantity,
        isUpdate: isUpdate
      });
  
      const data = response.data;
  
      if (data.event) {
        setYesPrice(data.event.yes);
        setNoPrice(data.event.no);
      }
  
      // Deduct balance
      setBalance(prev => prev - costAmount);
  
      // Show success state briefly
      setSuccess(true);
      const updatedUser = await api.get('/auth/me');
      setBalance(updatedUser.data.balance);
  
      if (onVoteComplete) {
        onVoteComplete(data);
      }
    } catch (err) {
      console.log("Error placing vote:", err);
      
      if (err.response?.data?.hasVoted) {
        setError('You have already voted on this event. Please use the update vote feature from your profile.');
      } else {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Listen for socket updates
  useEffect(() => {
    // This would be where you connect to your socket if using socket.io-client
    // Example:
    // const socket = io();
    // socket.on('voteUpdated', (data) => {
    //   if (data.eventId === eventId) {
    //     setYesPrice(data.yesPrice);
    //     setNoPrice(data.noPrice);
    //   }
    // });
    // 
    // return () => {
    //   socket.off('voteUpdated');
    // };

    // For now, let's fetch the latest event data when component mounts
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        if (response.ok) {
          const eventData = await response.json();
          setYesPrice(eventData.yes);
          setNoPrice(eventData.no);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    
    fetchEvent();
  }, [eventId]);

  const handleRechargeComplete = (newBalance) => {
    setBalance(newBalance);
    setError(null); // Clear any insufficient balance errors
  };

  return (
    <div className="flex flex-col w-full max-w-md bg-white rounded-lg shadow-md p-4">
      {/* Event Question Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {question || "Nottingham Forest to win against Crystal Palace?"}
        </h2>
      </div>
      
      {/* Yes/No Options */}
      <div className="flex mb-6 space-x-2">
        <button
          className={`flex-1 py-3 rounded-md ${
            selectedOption === 'yes' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setSelectedOption('yes')}
        >
          Yes ₹{yesPrice.toFixed(1)}
        </button>
        <button
          className={`flex-1 py-3 rounded-md ${
            selectedOption === 'no' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setSelectedOption('no')}
        >
          No ₹{noPrice.toFixed(1)}
        </button>
      </div>
      
      {/* Quantity Selector */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Quantity</span>
          <span className="font-semibold">{quantity}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            onClick={decreaseQuantity}
            className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center"
            disabled={quantity <= 1}
          >
            <span className="text-xl font-bold">-</span>
          </button>
          
          <div className="flex-1 mx-4 bg-gray-100 h-2 rounded-full">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${Math.min((quantity / 10) * 100, 100)}%` }}
            ></div>
          </div>
          
          <button 
            onClick={increaseQuantity}
            className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center"
          >
            <span className="text-xl font-bold">+</span>
          </button>
        </div>
        
        {/* Investment and Return */}
        <div className="flex justify-between mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              ₹{costAmount.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">
              You put in
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              ₹{returnAmount.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">
              You Get
            </p>
          </div>
        </div>
      </div>
      
      {/* Error Message - only show if there's an error */}
      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-lg">
          <div className="flex items-center text-red-500 mb-1">
            <AlertTriangle size={16} className="mr-1" />
            <span className="font-medium">
              {error}
            </span>
            
          </div>
          
          {insufficientFunds && (
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium">
              Recharge
            </button>
          )}
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 p-4 rounded-lg">
          <div className="flex items-center text-green-500">
            <span className="font-medium">Vote placed successfully!</span>
          </div>
        </div>
      )}
      
      {/* Vote Button */}
      <button
        className={`relative h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg text-white font-bold flex items-center justify-center ${
          insufficientFunds || loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={insufficientFunds || loading}
        onClick={handleVote}
      >
        <div className="absolute right-3 bg-white rounded-full h-8 w-8 flex items-center justify-center ">
          <ChevronRight className="text-blue-500" size={20} />
        </div>
        {loading ? 'Processing...' : `${isUpdate ? 'Update' : 'Confirm'} ${selectedOption.toUpperCase()}`}
      </button>
      
      {/* Balance */}
      
      <div className="mt-4 text-center text-gray-600">
        Available Balance: ₹{balance.toFixed(2)}
        <button 
          onClick={() => setShowRechargeModal(true)}
          className="w-full text-blue-500 py-2 text-md hover:text-blue-600 transition-colors"
        >
          Recharge?
        </button>
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <RechargeModal
          onClose={() => setShowRechargeModal(false)}
          onRechargeComplete={handleRechargeComplete}
        />
      )}
    </div>
  );
}