import { io } from 'socket.io-client';
const socket = io('http://192.168.0.34:3000/');

socket.on('connect', () => {
    console.log('connected to Mac');

    socket.on('clientEvent', data => {
        console.log('message from the server:', data);
        socket.emit('serverEvent', 'thanks server! for "' + data + '".');
    });
});