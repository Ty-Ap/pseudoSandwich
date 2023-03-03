'use strict';

const { io } = require('socket.io-client');
const socket = io.connect('http://localhost:3001/sand');

var Chance = require('chance');
var chance = new Chance();

socket.emit('GET-ORDERS', {queueId: 'sandwich-ORDER-COMPLETE'});

const generateSandwich=()=>{
  let payload = {
    orderId: chance.guid(),
    customer: chance.name(),
    queueId: 'sandwich',
    currentEmit: '',
  };

  payload.currentEmit = 'ORDER-READY';
  console.log('[cashier/index.js 20] PAYLOAD.CURRENT-EMIT:',payload.currentEmit);
  socket.emit('ORDER-READY', payload);
};

socket.on('ORDER-COMPLETE', (payload)=>{
  payload.currentEmit = 'ORDER-DELIVERED';
  console.log('[cashier/index.js 26] PAYLOAD.CURRENT-EMIT:',payload.currentEmit);
  socket.emit('ORDER-DELIVERED', payload);
});

setInterval(()=>{
  generateSandwich();
},6000);

// socket.emit('ORDER READY', payload);
