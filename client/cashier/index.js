'use strict';

const { io } = require('socket.io-client');
const socket = io.connect('http://localhost:3001/sand');

var Chance = require('chance');
var chance = new Chance();

const generateSandwich=()=>{
  let payload = {
    orderId: chance.guid(),
    customer: chance.name(),
  };
  socket.emit('ORDER-READY', payload);
};

socket.on('ORDER-COMPLETE', (payload)=>{
  socket.emit('ORDER-DELIVERED', payload);
});

setInterval(()=>{
  generateSandwich();
},2000);

// socket.emit('ORDER READY', payload);
