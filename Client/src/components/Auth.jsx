import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/authContext';

function Auth({setIsOpen, onSuccess}) {
  const [login, setLogin] = useState(true);
  const [signup, setSignup] = useState(false);
  const [forgotPwd, setForgotPwd] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate();
  const { login: authLogin, user, setUser } = useAuth();

  // If user is already logged in, close the modal
  useEffect(() => {
    if (user) {
      setIsOpen(false);
      if (onSuccess) onSuccess();
    }
  }, [user, setIsOpen, onSuccess]);

  const handleLogin = async (e) =>{
    e.preventDefault();

    try{
      const res = await axios.post('http://localhost:4001/auth/login', {
        username,
        password
      }, { withCredentials: true });

      const resData = await axios.get("http://localhost:4001/auth/me", { withCredentials: true });
      setUser(resData.data);
      
      toast.success('Welcome back!! Login successful 🎉');

      setIsOpen(false);
      if (onSuccess) onSuccess();
      setLogin(true);
      navigate('/');
    }catch(err){
      console.error('Login error:', err.response?.data?.message || err.message);
      toast.error('Login failed: Please check your credentials.');
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading('Signing you up! Please wait...');
  
    if (password !== confirmPassword) {
      toast.dismiss(loadingToastId);
      toast.error('Passwords do not match! 🥹');
      return;
    }

    try {
      const signupRes = await axios.post('http://localhost:4001/auth/signup', {
        username,
        email,
        password
      }, { withCredentials: true });
  
      // Set user data directly from the signup response
      setUser(signupRes.data.user);
      
      toast.success('Signup successful! Welcome to Opiniofied! 🎉');
      toast.dismiss(loadingToastId);
      setIsOpen(false);
      if (onSuccess) onSuccess();
      navigate('/');
    } catch (err) {
      toast.dismiss(loadingToastId);

      const message = err.response?.data?.message || 'Signup failed. Please try again.';
    
      if (message.includes('Username or email already exists')) {
        toast.error('Username or email already exists. Please try different credentials!');
      } else {
        toast.error(message);
      }
    }
  };
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading('Processing your request...');
    
    if (!username) {
      toast.dismiss(loadingToastId);
      toast.error('Please enter your username');
      return;
    }
    
    try {
      await axios.post('http://localhost:4001/auth/forgot-password', {
        username
      });
      
      toast.dismiss(loadingToastId);
      toast.success('If your account exists, you will receive an email with reset instructions.');
      
      setForgotPwd(false);
      setLogin(true);
    } catch (err) {
      toast.dismiss(loadingToastId);
      console.error('Reset request error:', err);
      toast.success('If your account exists, you will receive an email with reset instructions.');
    }
  };

  const showLoginView = () => {
    setLogin(true);
    setSignup(false);
    setForgotPwd(false);
  };
  
  const showSignupView = () => {
    setLogin(false);
    setSignup(true);
    setForgotPwd(false);
  };
  
  const showForgotPasswordView = () => {
    setLogin(false);
    setSignup(false);
    setForgotPwd(true);
  };

  const inputClasses = "w-full px-4 py-2 bg-zinc-800 rounded-lg mt-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500";
  const labelClasses = "block text-sm font-medium text-gray-300";
  const buttonClasses = "w-full bg-black text-white py-2 rounded-lg hover:bg-zinc-950 transition duration-300 font-medium";
  const toggleButtonClasses = (active) => `px-6 py-2 rounded-full font-medium transition duration-300 ${
    active ? 'bg-black text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
  }`;

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className="w-full max-w-md mx-auto bg-zinc-900 rounded-xl shadow-lg p-6 text-center"
    >
      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={showLoginView}
          className={toggleButtonClasses(login)}
        >
          Login
        </button>
        <button
          onClick={showSignupView}
          className={toggleButtonClasses(signup)}
        >
          Sign Up
        </button>
      </div>

      {/* Login Form */}
      {login && (
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="text-left">
            <label className={labelClasses}>Username</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="text-left relative">
            <label className={labelClasses}>Password</label>
            <input
              type={showLoginPassword ? "text" : "password"}
              className={inputClasses}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute right-3 top-9 text-sm text-blue-400 hover:text-blue-300"
            >
              {showLoginPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="text-right">
            <button 
              type="button"
              onClick={showForgotPasswordView}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className={buttonClasses}>
            Login
          </button>
        </form>
      )}

      {/* Signup Form */}
      {signup && (
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="text-left">
            <label className={labelClasses}>Email</label>
            <input
              type="email"
              className={inputClasses}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="text-left">
            <label className={labelClasses}>Username</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="text-left relative">
            <label className={labelClasses}>Password</label>
            <input
              type={showSignupPassword ? "text" : "password"}
              className={inputClasses}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowSignupPassword(!showSignupPassword)}
              className="absolute right-3 top-9 text-sm text-blue-400 hover:text-blue-300"
            >
              {showSignupPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="text-left relative">
            <label className={labelClasses}>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={inputClasses}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-sm text-blue-400 hover:text-blue-300"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className={buttonClasses}>
            Sign Up
          </button>
        </form>
      )}

      {/* Forgot Password Form */}
      {forgotPwd && (
        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div className="text-left">
            <p className="mb-4 text-gray-400 text-sm">
              Enter your username and we'll send you a link to reset your password.
            </p>
            <label className={labelClasses}>Username</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={buttonClasses}>
            Send Reset Link
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={showLoginView}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

export default Auth;
