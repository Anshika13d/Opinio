import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

// Create a singleton socket instance
const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 60000,
  forceNew: true
});

// Add connection event listeners
socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
  // Try to reconnect with polling if websocket fails
  if (socket.io.opts.transports.includes('websocket')) {
    console.log('Falling back to polling transport');
    socket.io.opts.transports = ['polling'];
    socket.connect();
  }
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from socket server:', reason);
  if (reason === 'io server disconnect') {
    // the disconnection was initiated by the server, you need to reconnect manually
    socket.connect();
  }
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

export default socket; 