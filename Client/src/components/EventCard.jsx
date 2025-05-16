import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function EventCard({
  traderCount = 0,
  question = "Is pineapple on pizza good?",
  description = "",
  yes = "₹4.9",
  no = "₹5.1",
  onYesClick = () => {},
  onNoClick = () => {},
  eventId = "",
  endingAt,
  status = "active",
  category = "all"
}) {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const endDate = new Date(endingAt);
      
      if (now >= endDate) {
        setTimeRemaining("Ended");
        return;
      }
      
      setTimeRemaining(formatDistanceToNow(endDate, { addSuffix: true }));
    };

    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [endingAt]);

  const handleKnowMore = () => {
    console.log(eventId);
    
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="group relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl shadow-xl w-full overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl h-[380px] flex flex-col justify-between">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="p-4 flex-grow">
        <div className="flex items-center justify-between text-zinc-400 mb-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"></path>
            </svg>
            <span className="font-medium text-sm">{traderCount.toLocaleString()} votes placed</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'active' 
              ? 'bg-green-900/30 text-green-400'
              : 'bg-red-900/30 text-red-400'
          }`}>
            {timeRemaining}
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-200 transition-colors duration-300 line-clamp-2">{question}</h3>

        <div className="text-sm text-zinc-400 mb-4 line-clamp-2">{description}</div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <span className="block text-sm text-green-400 mb-1">Yes</span>
            <span className="font-bold text-lg text-white">{yes}</span>
          </div>
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <span className="block text-sm text-red-400 mb-1">No</span>
            <span className="font-bold text-lg text-white">{no}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 ">
        <div className="grid grid-cols-2 ">
          <button
            onClick={onYesClick}
            disabled={status !== 'active'}
            className={`bg-green-900/50 text-green-100 font-semibold py-3 px-4 transition duration-200 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            Yes
          </button>
          <button
            onClick={onNoClick}
            disabled={status !== 'active'}
            className={`bg-red-900/50 text-red-100 font-semibold py-3 px-4 transition duration-200 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            No
          </button>
        </div>
        <button
          onClick={handleKnowMore}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-2 px-4 transition duration-200 flex items-center justify-center gap-2 group"
        >
          Know More
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default EventCard;
