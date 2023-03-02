'use strict';

const { io } = require('socket.io-client');
const socket = io.connect('http://localhost:3001/sand');

socket.on('ORDER-READY', (payload)=>{
  setTimeout(()=>{
    socket.emit('ORDER-COMPLETE', payload);
  },1000);
});
