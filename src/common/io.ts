import io from 'websocket';
const socket = io('http://192.168.0.34:3000/');

socket.emit('join', 1234, 5678);

socket.on('user-connected', userId => {
    console.log(userId);
});