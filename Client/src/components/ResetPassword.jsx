import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`http://localhost:4001/auth/reset-password/${token}`, {
        newPassword
      });
      
      toast.success('Password reset successfully!');
      setResetComplete(true);
      setIsLoading(false);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      setIsLoading(false);
      console.error('Reset password error:', err.response?.data?.message || err.message);
      
      if (err.response?.status === 400) {
        toast.error('Invalid or expired reset link. Please request a new one.');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Reset Your Password</h2>
        
        {resetComplete ? (
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-lg mb-4">
              <p className="text-green-700">Your password has been successfully reset!</p>
            </div>
            <p className="mb-4 text-gray-300">You'll be redirected to the login page in a moment.</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="flex flex-col relative">
              <label className="font-semibold text-sm mb-1 text-gray-300">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="bg-zinc-800 text-white rounded-md p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-sm text-blue-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <div className="flex flex-col relative">
              <label className="font-semibold text-sm mb-1 text-gray-300">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="bg-zinc-800 text-white rounded-md p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-sm text-blue-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black text-white py-3 rounded-lg transition duration-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-zinc-950'
              }`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;