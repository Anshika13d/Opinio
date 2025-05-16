import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

// Create a singleton socket instance
const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true
});

export default socket; 