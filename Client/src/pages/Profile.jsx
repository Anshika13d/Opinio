import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Voting from '../components/Voting';
import RechargeModal from '../components/RechargeModal';
import socket from '../utils/socket';

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
    
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordChangeStatus({
        message: 'New passwords do not match',
        type: 'error'
      });
      return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 6) {
      setPasswordChangeStatus({
        message: 'Password must be at least 6 characters long',
        type: 'error'
      });
      return;
    }

    try {
      // First request a password reset token
      await axios.post('https://opinio-backend-pyno.onrender.com/auth/forgot-password', {
        username: passwordForm.username
      });

      setPasswordChangeStatus({
        message: 'Password reset email has been sent to your email address',
        type: 'success'
      });

      // Clear the form and close the modal
      setPasswordForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setIsChangingPassword(false);

    } catch (err) {
      setPasswordChangeStatus({
        message: err.response?.data?.message || 'Failed to change password',
        type: 'error'
      });
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleUpdateVote = (event) => {
    setSelectedEvent(event);
    setShowVoting(true);
  };

  const handleVoteUpdateComplete = (data) => {
    // Update the event in the votedEvents list
    setVotedEvents(prevEvents =>
      prevEvents.map(event =>
        event._id === data.event._id ? data.event : event
      )
    );
    // Removed automatic closing of modal
  };

  const handleRechargeComplete = (newBalance) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  if (loading) return <div className="text-center p-8 text-white">Loading profile...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-center p-8 text-white">Please log in to view your profile</div>;

  return (
    <div className="min-h-screen pb-16 text-white pt-12">
      <div className="max-w-6xl mx-auto">
        {/* User Info Section */}
        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg mb-8">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Username</label>
                <div className="text-xl font-semibold">{user.username}</div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <div className="text-xl">{user.email}</div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Balance</label>
                <div className="text-xl font-semibold text-green-500">₹{user.balance?.toFixed(2) || '0.00'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Last Login</label>
                <div className="text-lg">
                  {format(new Date(user.lastLogin), 'PPpp')}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Member Since</label>
                <div className="text-lg">
                  {format(new Date(user.createdAt), 'PPP')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Created Events Section */}
        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">My Created Events</h2>
          
          {eventDeleteStatus.message && (
            <div className={`p-3 rounded-lg mb-4 ${
              eventDeleteStatus.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
            }`}>
              {eventDeleteStatus.message}
            </div>
          )}

          {userEvents.length === 0 ? (
            <p className="text-gray-400">You haven't created any events yet.</p>
          ) : (
            <div className="grid gap-4">
              {userEvents.map(event => (
                <div 
                  key={event._id} 
                  className="bg-zinc-800 rounded-lg p-4 cursor-pointer hover:bg-zinc-700 transition-colors"
                  onClick={() => handleEventClick(event._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{event.question}</h3>
                      <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Yes Votes: {event.yesVotes}</span>
                        <span>No Votes: {event.noVotes}</span>
                        <span>Created: {format(new Date(event.createdAt), 'PP')}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event._id);
                      }}
                      className="text-red-500 hover:text-red-400 transition-colors p-2"
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

        {/* Voted Events Section */}
        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">My Voted Events</h2>
          
          {votedEvents.length === 0 ? (
            <p className="text-gray-400">You haven't voted on any events yet.</p>
          ) : (
            <div className="grid gap-4">
              {votedEvents.map(event => {
                // Calculate if user won (only for ended events)
                const hasEnded = event.status === 'ended';
                const userVotedYes = event.userVote.vote === 'yes';
                const yesWon = event.outcome === 'yes';
                const hasWon = hasEnded && ((userVotedYes && yesWon) || (!userVotedYes && !yesWon));
                
                return (
                  <div 
                    key={event._id} 
                    className={`bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition-colors ${
                      hasEnded ? (hasWon ? 'border-2 border-green-500' : 'border-2 border-red-500') : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{event.question}</h3>
                        <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className={event.userVote.vote === 'yes' ? 'text-green-500' : 'text-red-500'}>
                            Voted: {event.userVote.vote.toUpperCase()}
                          </span>
                          <span className="text-gray-400">
                            Quantity: {event.userVote.quantity}
                          </span>
                          <span className="text-gray-400">
                            Voted on: {format(new Date(event.userVote.timestamp), 'PP')}
                          </span>
                          <span className="text-gray-400">
                            Created by: {event.createdBy?.username || 'Anonymous'}
                          </span>
                          {/* Add status badges */}
                          {hasEnded ? (
                            <span className={`font-semibold ${hasWon ? 'text-green-500' : 'text-red-500'}`}>
                              {hasWon ? '🎉 Won!' : '😔 Lost'}
                            </span>
                          ) : (
                            <span className="text-yellow-500 font-semibold">
                              🕒 In Progress
                            </span>
                          )}
                        </div>
                        {/* Add vote distribution */}
                        {hasEnded && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-400">
                              Final Result: {event.outcome.toUpperCase()} won ({event.yesVotes} Yes vs {event.noVotes} No votes)
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!hasEnded && (
                          <button
                            onClick={() => handleUpdateVote(event)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            Update Vote
                          </button>
                        )}
                        <button
                          onClick={() => handleEventClick(event._id)}
                          className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
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

        <div className="mt-8 pt-6 border-t border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <div className="flex gap-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </button>
            <button
              className="px-4 py-2 rounded-lg transition duration-200 bg-blue-500 hover:bg-blue-600"
              onClick={() => setShowRechargeModal(true)}
            >
              Recharge
            </button>
          </div>
        </div>

        {/* Password Change Modal */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Change Password</h2>
              
              {passwordChangeStatus.message && (
                <div className={`p-3 rounded-lg mb-4 ${
                  passwordChangeStatus.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
                }`}>
                  {passwordChangeStatus.message}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full bg-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition duration-200"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordChangeStatus({ message: '', type: '' });
                      setPasswordForm(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                    }}
                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Voting Modal */}
        {showVoting && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl relative w-[90%] max-w-md">
              <button
                className="absolute top-2 right-2 text-gray-700"
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
