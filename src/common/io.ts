import { io } from 'socket.io-client';
const socket = io('http://192.168.0.34:3000/room');

socket.emit('join', 1234, 5678);

socket.on('user-connected', userId => {
    console.log(userId);
});