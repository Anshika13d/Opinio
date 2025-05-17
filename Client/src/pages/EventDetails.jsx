import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { useAuth } from '../context/authContext';
import Voting from '../components/Voting';
import Auth from '../components/Auth';
import toast from 'react-hot-toast';
import socket from '../utils/socket'; // Make sure this path is correct

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVoting, setShowVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching event details for ID:', eventId);
        
        const response = await api.get(`/events/${eventId}`);

        console.log('Raw API Response:', response.data);

        if (response.data && response.data.event) {
          console.log('Event data received:', response.data.event);
          setEvent(response.data.event);
          setPriceHistory(response.data.priceHistory || []);
        } else {
          console.error('Invalid response structure:', response.data);
          throw new Error('Invalid response structure from server');
        }
      } catch (err) {
        console.error('Full error object:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }

    // Socket connection for real-time updates
    socket.on('voteUpdated', (data) => {
      if (data.eventId === eventId) {
        setEvent(prev => ({
          ...prev,
          yesVotes: data.yesVotes,
          noVotes: data.noVotes,
          yes: data.yesPrice,
          no: data.noPrice,
        }));

        setPriceHistory(prev => [...prev, {
          timestamp: new Date(),
          yesPrice: data.yesPrice,
          noPrice: data.noPrice
        }]);
      }
    });

    return () => {
      socket.off('voteUpdated');
    };
  }, [eventId]);

  const handleVote = (option) => {
    if (!user) {
      toast.error('You must be logged in to vote!');
      setIsAuthOpen(true);
      return;
    }
    setShowVoting(true);
    setSelectedOption(option);
  };

  const handleVoteComplete = (data) => {
    setEvent(data.event);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    if (selectedOption) {
      setShowVoting(true);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading event details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center ">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p>Event not found</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  const priceChartData = {
    labels: priceHistory.map(record => format(new Date(record.timestamp), 'MMM dd HH:mm')),
    datasets: [
      {
        label: 'Yes Price',
        data: priceHistory.map(record => record.yesPrice),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'No Price',
        data: priceHistory.map(record => record.noPrice),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4
      },
    ],
  };

  const votingDistributionData = {
    labels: ['Yes Votes', 'No Votes'],
    datasets: [
      {
        data: [event.yesVotes || 0, event.noVotes || 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pt-8 sm:pt-12">
        <div className="bg-zinc-900 rounded-xl p-4 sm:p-6 shadow-lg mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{event.question}</h1>
          <p className="text-gray-400 mb-6">{event.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {/* Current Prices */}
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Current Prices</h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-green-500">Yes</p>
                  <p className="text-2xl font-bold">₹{event.yes?.toFixed(1) || 0}</p>
                </div>
                <div>
                  <p className="text-red-500">No</p>
                  <p className="text-2xl font-bold">₹{event.no?.toFixed(1) || 0}</p>
                </div>
              </div>
            </div>

            {/* Total Votes */}
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Votes</h3>
              <p className="text-2xl font-bold">{(event.yesVotes || 0) + (event.noVotes || 0)}</p>
            </div>

            {/* Event Status */}
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Event Status</h3>
              <div>
                <p className="text-lg">
                  {event.status === 'active' ? (
                    <span className="text-green-500">Active</span>
                  ) : (
                    <span className="text-red-500">Ended</span>
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  Ends: {format(new Date(event.endingAt), 'PPp')}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(event.endingAt) > new Date() 
                    ? `(${formatDistanceToNow(new Date(event.endingAt), { addSuffix: true })})`
                    : '(Event has ended)'}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Price History Chart */}
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Price History</h3>
              <div className="w-full h-[300px] sm:h-[400px]">
                {priceHistory.length > 0 ? (
                  <Line
                    data={priceChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            color: 'white',
                            font: {
                              size: 12
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          },
                          ticks: {
                            color: 'white',
                            font: {
                              size: 11
                            }
                          }
                        },
                        x: {
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          },
                          ticks: {
                            color: 'white',
                            font: {
                              size: 11
                            },
                            maxRotation: 45,
                            minRotation: 45
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <p className="text-center text-gray-400">No price history available yet</p>
                )}
              </div>
            </div>

            {/* Vote Distribution Chart */}
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Vote Distribution</h3>
              <div className="w-full aspect-square max-w-[400px] mx-auto">
                <Pie
                  data={votingDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: 'white',
                          font: {
                            size: 12
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Voting Buttons */}
          {event.status === 'active' && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleVote('yes')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors w-full sm:w-auto"
              >
                Vote Yes
              </button>
              <button
                onClick={() => handleVote('no')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors w-full sm:w-auto"
              >
                Vote No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Voting Modal */}
      {showVoting && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
          <div className="bg-zinc-900 p-4 sm:p-6 rounded-xl relative w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => {
                setShowVoting(false);
                setSelectedOption(null);
              }}
            >
              ✕
            </button>
            <Voting
              eventId={event._id}
              question={event.question}
              initialYesPrice={event.yes}
              initialNoPrice={event.no}
              selectedOptionHere={selectedOption}
              onVoteComplete={handleVoteComplete}
            />
          </div>
        </motion.div>
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <Auth
          setIsOpen={setIsAuthOpen}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default EventDetails;
