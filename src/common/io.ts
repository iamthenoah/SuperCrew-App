import { io } from 'socket.io-client';
const socket = io('https://supercrew.herokuapp.com');

socket.on('connect', () => {
    console.log('connected to server');

    socket.on('clientEvent', data => {
        console.log('message from the server:', data);
        socket.emit('serverEvent', 'thanks server! for "' + data + '".');
    });
});