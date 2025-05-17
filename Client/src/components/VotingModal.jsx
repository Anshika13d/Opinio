import React, { useState } from 'react';

const VotingModal = ({ event, isOpen, onClose }) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (choice) => {
    try {
      setIsVoting(true);
      const response = await fetch('/api/events/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id,
          choice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      // Close modal after successful vote
      onClose();
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg max-w-lg w-full p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="px-3 py-1 text-sm bg-zinc-900 text-white rounded-sm">
              {event.category}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4">{event.question}</h3>
          <p className="text-gray-300 mb-6">{event.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleVote('yes')}
              disabled={isVoting}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Yes
            </button>
            <button
              onClick={() => handleVote('no')}
              disabled={isVoting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-400 flex justify-between">
          <span>Created by {event.creator}</span>
          <span>{event.votes} votes</span>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;