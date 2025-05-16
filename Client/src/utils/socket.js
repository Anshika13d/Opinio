import { io } from 'socket.io-client';

// Create a singleton socket instance
const socket = io('http://localhost:4001', {
  withCredentials: true,
  autoConnect: true
});

export default socket; 