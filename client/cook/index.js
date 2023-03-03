'use strict';

const { io } = require('socket.io-client');
const socket = io.connect('http://localhost:3001/sand');

socket.emit('GET-ORDERS', {queueId: 'sandwich-ORDER-READY'});

socket.on('ORDER-READY', (payload)=>{
  setTimeout(()=>{
    payload.currentEmit = 'ORDER-COMPLETE';
    console.log('[cook/index.js 11] PAYLOAD.CURRENT-EMIT:',payload.currentEmit);
    socket.emit('ORDER-COMPLETE', payload);
  },2000);
});
