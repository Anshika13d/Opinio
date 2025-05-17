import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaTrash, FaUser, FaEnvelope, FaWallet, FaClock, FaCalendar, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Voting from '../components/Voting';
import RechargeModal from '../components/RechargeModal';
import socket from '../utils/socket';
import { toast } from 'react-hot-toast';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState({ message: '', type: '' });
  const [userEvents, setUserEvents] = useState([]);
  const [votedEvents, setVotedEvents] = useState([]);
  const [eventDeleteStatus, setEventDeleteStatus] = useState({ message: '', type: '' });
  const [showVoting, setShowVoting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const navigate = useNavigate();
  const [showCreatedEvents, setShowCreatedEvents] = useState(true);
  const [showVotedEvents, setShowVotedEvents] = useState(true);

  // Add state for password change form
  const [passwordForm, setPasswordForm] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const userResponse = await axios.get('https://opinio-backend-pyno.onrender.com/auth/me', {
          withCredentials: true
        });
        setUser(userResponse.data);
        setPasswordForm(prev => ({ ...prev, username: userResponse.data.username }));
        
        // Fetch user's created events
        const eventsResponse = await axios.get('https://opinio-backend-pyno.onrender.com/events', {
          withCredentials: true
        });
        const userEvents = eventsResponse.data.filter(
          event => event.createdBy?._id === userResponse.data._id
        );
        setUserEvents(userEvents);

        // Fetch user's voted events
        const votedEventsResponse = await axios.get('https://opinio-backend-pyno.onrender.com/events/user/voted', {
          withCredentials: true
        });
        // Filter out any null events (they might have been deleted)
        const validVotedEvents = votedEventsResponse.data.filter(event => event !== null);
        setVotedEvents(validVotedEvents);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    socket.on('userBalanceUpdated', (data) => {
      if (data.userId === user?._id) {
        setUser(prev => ({
          ...prev,
          balance: data.newBalance
        }));
      }
    });

    socket.on('balanceUpdated', async () => {
      // Refresh user data when any balance update occurs
      try {
        const response = await axios.get('https://opinio-backend-pyno.onrender.com/auth/me', {
          withCredentials: true
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error refreshing user data:', err);
      }
    });

    return () => {
      socket.off('userBalanceUpdated');
      socket.off('balanceUpdated');
    };
  }, [user?._id]);

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`https://opinio-backend-pyno.onrender.com/events/${eventId}`, {
        withCredentials: true
      });
      
      setUserEvents(prev => prev.filter(event => event._id !== eventId));
      
      setEventDeleteStatus({
        message: 'Event deleted successfully',
        type: 'success'
      });

      setTimeout(() => {
        setEventDeleteStatus({ message: '', type: '' });
      }, 3000);
    } catch (err) {
      setEventDeleteStatus({
        message: err.response?.data?.message || 'Failed to delete event',
        type: 'error'
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    try {
      // Request a password reset token using the user's username
      const response = await axios.post('https://opinio-backend-pyno.onrender.com/auth/forgot-password', {
        username: user.username
      });

      toast.success('Password reset email has been sent to your email address');
      
      // Close the modal
      setIsChangingPassword(false);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate password reset');
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleUpdateVote = (event) => {
    setSelectedEvent(event);
    setShowVoting(true);
  };

  const handleVoteUpdateComplete = async (data) => {
    try {
      // Refresh voted events list
      const votedEventsResponse = await axios.get('https://opinio-backend-pyno.onrender.com/events/user/voted', {
        withCredentials: true
      });
      // Filter out any null events (they might have been deleted)
      const validVotedEvents = votedEventsResponse.data.filter(event => event !== null);
      setVotedEvents(validVotedEvents);
      setShowVoting(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error refreshing voted events:', err);
    }
  };

  const handleRechargeComplete = (newBalance) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  if (loading) return <div className="text-center p-8 text-white">Loading profile...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-center p-8 text-white">Please log in to view your profile</div>;

  return (
    <div className="min-h-screen pb-16 text-white pt-12 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Info Section */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 shadow-xl mb-8 border border-zinc-700/30 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-8 bg-white to-purple-500 bg-clip-text text-transparent">Profile Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-xl">
                <FaUser className="text-2xl text-blue-500" />
                <div>
                  <label className="text-gray-400 text-sm">Username</label>
                  <div className="text-xl font-semibold">{user.username}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-xl">
                <FaEnvelope className="text-2xl text-purple-500" />
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <div className="text-xl">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-xl">
                <FaWallet className="text-2xl text-green-500" />
                <div>
                  <label className="text-gray-400 text-sm">Balance</label>
                  <div className="text-xl font-semibold text-green-500">₹{user.balance?.toFixed(2) || '0.00'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-xl">
                <FaClock className="text-2xl text-orange-500" />
                <div>
                  <label className="text-gray-400 text-sm">Last Login</label>
                  <div className="text-lg">
                    {format(new Date(user.lastLogin), 'PPpp')}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-xl">
                <FaCalendar className="text-2xl text-pink-500" />
                <div>
                  <label className="text-gray-400 text-sm">Member Since</label>
                  <div className="text-lg">
                    {format(new Date(user.createdAt), 'PPP')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Created Events Section */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 shadow-xl mb-8 border border-zinc-700/30">
          <div className="flex justify-between items-center mb-6">
            <button className="text-3xl font-bold bg-white bg-clip-text text-transparent"
            onClick={() => setShowCreatedEvents(!showCreatedEvents)}
            >
              My Created Events
            </button>
            <button
              onClick={() => setShowCreatedEvents(!showCreatedEvents)}
              className="p-2 hover:bg-zinc-700/50 rounded-full transition-colors"
            >
              <FaChevronDown
                className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                  showCreatedEvents ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
          
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showCreatedEvents ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            {eventDeleteStatus.message && (
              <div className={`p-4 rounded-xl mb-6 ${
                eventDeleteStatus.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
              }`}>
                {eventDeleteStatus.message}
              </div>
            )}

            {userEvents.length === 0 ? (
              <div className="text-center py-8 bg-zinc-800/50 rounded-xl">
                <p className="text-gray-400 text-lg">You haven't created any events yet.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {userEvents.map(event => (
                  <div 
                    key={event._id} 
                    className="bg-zinc-800/50 rounded-xl p-6 cursor-pointer hover:bg-zinc-700/50 transition-all duration-300 transform hover:scale-[1.02] border border-zinc-700/30"
                    onClick={() => handleEventClick(event._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3">{event.question}</h3>
                        <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span className="px-3 py-1 bg-zinc-700/50 rounded-full">Yes Votes: {event.yesVotes}</span>
                          <span className="px-3 py-1 bg-zinc-700/50 rounded-full">No Votes: {event.noVotes}</span>
                          <span className="px-3 py-1 bg-zinc-700/50 rounded-full">Created: {format(new Date(event.createdAt), 'PP')}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event._id);
                        }}
                        className="text-red-500 hover:text-red-400 transition-colors p-3 hover:bg-red-500/10 rounded-full"
                        title="Delete Event"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Voted Events Section */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 shadow-xl border border-zinc-700/30">
          <div className="flex justify-between items-center mb-6">
            <button className="text-3xl font-bold bg-white bg-clip-text text-transparent"
            onClick={() => setShowVotedEvents(!showVotedEvents)}
            >
              My Voted Events
            </button>
            <button
              onClick={() => setShowVotedEvents(!showVotedEvents)}
              className="p-2 hover:bg-zinc-700/50 rounded-full transition-colors"
            >
              <FaChevronDown
                className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                  showVotedEvents ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
          
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showVotedEvents ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            {votedEvents.length === 0 ? (
              <div className="text-center py-8 bg-zinc-800/50 rounded-xl">
                <p className="text-gray-400 text-lg">You haven't voted on any events yet.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {votedEvents.map(event => {
                  const hasEnded = event.status === 'ended';
                  const userVotedYes = event.userVote.vote === 'yes';
                  const yesWon = event.outcome === 'yes';
                  const hasWon = hasEnded && ((userVotedYes && yesWon) || (!userVotedYes && !yesWon));
                  
                  return (
                    <div 
                      key={event._id} 
                      className={`bg-zinc-800/50 rounded-xl p-6 hover:bg-zinc-700/50 transition-all duration-300 transform hover:scale-[1.02] ${
                        hasEnded ? (hasWon ? 'border-2 border-green-500/50' : 'border-2 border-red-500/50') : 'border border-zinc-700/30'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-3">{event.question}</h3>
                          <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className={`px-3 py-1 rounded-full ${event.userVote.vote === 'yes' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              Voted: {event.userVote.vote.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 bg-zinc-700/50 rounded-full text-gray-300">
                              Quantity: {event.userVote.quantity}
                            </span>
                            <span className="px-3 py-1 bg-zinc-700/50 rounded-full text-gray-300">
                              {format(new Date(event.userVote.timestamp), 'PP')}
                            </span>
                            <span className="px-3 py-1 bg-zinc-700/50 rounded-full text-gray-300">
                              By: {event.createdBy?.username || 'Anonymous'}
                            </span>
                            {hasEnded ? (
                              <span className={`px-3 py-1 rounded-full font-semibold ${hasWon ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {hasWon ? '🎉 Won!' : '😔 Lost'}
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full font-semibold">
                                🕒 In Progress
                              </span>
                            )}
                          </div>
                          {hasEnded && (
                            <div className="mt-4 text-sm bg-zinc-700/30 p-3 rounded-lg">
                              <span className="text-gray-300">
                                Final Result: {event.outcome.toUpperCase()} won ({event.yesVotes} Yes vs {event.noVotes} No votes)
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                          {!hasEnded && (
                            <button
                              onClick={() => handleUpdateVote(event)}
                              className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium transition-colors"
                            >
                              Update Vote
                            </button>
                          )}
                          <button
                            onClick={() => handleEventClick(event._id)}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-zinc-600 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-700/30">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Account Actions</h2>
          <div className="flex gap-4">
            <button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition duration-300 font-medium"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </button>
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition duration-300 font-medium"
              onClick={() => setShowRechargeModal(true)}
            >
              Recharge
            </button>
          </div>
        </div>

        {/* Password Change Modal */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 w-full max-w-md border border-zinc-700/30">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Change Password</h2>
              
              <div className="text-gray-300 mb-6">
                Click the button below to receive a password reset link in your email.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl transition duration-300 font-medium"
                >
                  Send Reset Link
                </button>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl transition duration-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Voting Modal */}
        {showVoting && selectedEvent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-2xl relative w-[90%] max-w-md border border-zinc-700/30">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                onClick={() => {
                  setShowVoting(false);
                  setSelectedEvent(null);
                }}
              >
                ❌
              </button>
              <Voting
                eventId={selectedEvent._id}
                question={selectedEvent.question}
                initialYesPrice={selectedEvent.yes}
                initialNoPrice={selectedEvent.no}
                selectedOptionHere={selectedEvent.userVote.vote}
                isUpdate={true}
                onVoteComplete={handleVoteUpdateComplete}
              />
            </div>
          </div>
        )}

        {/* Recharge Modal */}
        {showRechargeModal && (
          <RechargeModal
            onClose={() => setShowRechargeModal(false)}
            onRechargeComplete={handleRechargeComplete}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
