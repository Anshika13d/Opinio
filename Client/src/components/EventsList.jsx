import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Voting from '../components/Voting';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import Auth from './Auth';
import socket from '../utils/socket';

export default function EventsList({selectedCategory}) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVoting, setShowVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeEventId, setActiveEventId] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const {user} = useAuth();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        // Only show active events
        const activeEvents = response.data.filter(event => event.status === 'active');
        setEvents(activeEvents);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Set up socket listener for real-time updates
    socket.on('eventEnded', (endedEventId) => {
      // Remove ended event from the list immediately
      setEvents(prevEvents => prevEvents.filter(event => event._id !== endedEventId));
    });

    socket.on('voteUpdated', (data) => {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === data.eventId
            ? {
                ...event,
                yesVotes: data.yesVotes,
                noVotes: data.noVotes,
                yes: data.yesPrice,
                no: data.noPrice,
              }
            : event
        )
      );
    });

    return () => {
      socket.off('eventEnded');
      socket.off('voteUpdated');
    };
  }, []);

  const handleVote = async (eventId, option) => {
    if (!user) {
      toast.error('You must be logged in to vote!');
      setIsAuthOpen(true);
      return;
    }
    const event = events.find(e => e._id === eventId);
    setSelectedEvent(event);
    setActiveEventId(eventId);
    setSelectedOption(option);
    setShowVoting(true);
  };

  const handleVoteComplete = (data) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event._id === data.event._id ? data.event : event
      )
    );
    setShowVoting(false);
    setSelectedEvent(null);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    if (selectedOption && activeEventId) {
      setShowVoting(true);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-4">
      Error: {error}
    </div>
  );

  const filteredEvents = selectedCategory === 'All'
  ? events
  : events.filter(event => event.category?.toLowerCase() === selectedCategory.toLowerCase());

  if (!events.length) return (
    <div className="text-center text-white p-4">
      No events found, try again later or create your own event!
    </div>
  );

  if(events.length === 0) return (
    <div className="text-center text-white p-4">
      No events found, try again later or create you own event!
    </div>
  )

  

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EventCard
              eventId={event._id}
              question={event.question}
              description={event.description}
              yes={`₹${event.yes?.toFixed(1) || 0}`}
              no={`₹${event.no?.toFixed(1) || 0}`}
              traderCount={event.yesVotes + event.noVotes}
              onYesClick={() => handleVote(event._id, 'yes')}
              onNoClick={() => handleVote(event._id, 'no')}
              endingAt={event.endingAt}
              status={event.status}
              category={event.category}
            />
          </motion.div>
        ))}
      </div>

      {showVoting && selectedEvent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowVoting(false);
                setSelectedEvent(null);
                setActiveEventId(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Voting
              eventId={selectedEvent._id}
              question={selectedEvent.question}
              initialYesPrice={selectedEvent.yes}
              initialNoPrice={selectedEvent.no}
              selectedOptionHere={selectedOption}
              onVoteComplete={handleVoteComplete}
            />
          </div>
        </motion.div>
      )}

      {isAuthOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setIsAuthOpen(false);
                setActiveEventId(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Auth onSuccess={handleAuthSuccess} setIsOpen={setIsAuthOpen} />
          </div>
        </motion.div>
      )}
    </>
  );
}
