import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import YouTube from 'react-youtube';

export default function RechargeModal({ onClose, onRechargeComplete }) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canClose, setCanClose] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => {
    let timer;
    if (!videoEnded && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanClose(true);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [videoEnded, timeLeft]);

  const handleReward = async () => {
    if (rewardClaimed) return;
    
    setLoading(true);
    try {
      const response = await api.post('/auth/recharge');
      setRewardClaimed(true);
      onRechargeComplete(response.data.newBalance);
      setTimeout(() => onClose(), 2000); // Auto close after showing success message
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to recharge balance');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setCanClose(true);
    handleReward();
  };

  const handleClose = () => {
    if (canClose) {
      if (!rewardClaimed) {
        handleReward();
      } else {
        onClose();
      }
    }
  };

  // Calculate responsive video dimensions
  const getVideoOpts = () => {
    // Get the current viewport width
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    
    // Base width on viewport size
    let width = vw < 768 ? vw - 48 : 640; // Subtract padding for mobile
    
    // Calculate height maintaining 16:9 aspect ratio
    let height = Math.floor(width * (9/16));
    
    return {
      height: height,
      width: width,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0
      }
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl max-w-3xl w-full mx-auto overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Watch to Earn ₹10</h2>
            {canClose && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="relative w-full">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              <YouTube
                videoId="FuXNumBwDOM"
                opts={getVideoOpts()}
                onEnd={handleVideoEnd}
                className="w-full h-full"
                iframeClassName="w-full h-full"
              />
            </div>
            {!canClose && (
              <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full">
                {timeLeft}s
              </div>
            )}
          </div>

          <div className="mt-4 text-center text-gray-300">
            {!canClose ? (
              <p>Watch for {timeLeft} seconds to earn ₹10. Please don't close this window.</p>
            ) : loading ? (
              <p>Processing your reward...</p>
            ) : rewardClaimed ? (
              <p className="text-green-500">Video completed! You earned ₹10!</p>
            ) : (
              <div>
                <p className="text-green-500 mb-2">Time's up! You can now claim your reward.</p>
                <button
                  onClick={handleReward}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Claim ₹10 Reward
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 