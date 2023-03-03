'use strict';

const { Server } = require('socket.io');
const Queue = require('./lib/queue.js');

const server = new Server();
const orderQueue = new Queue();

const sand = server.of('/sand');

sand.on('connection', (socket)=>{
  console.log('[server/index.js 12] connected to server');

  socket.on('ORDER-READY', (payload)=>{
    let currentQueue = orderQueue.read(`${payload.queueId}-${payload.currentEmit}`);
    console.log('[server/index.js 16]', `${payload.queueId}-${payload.currentEmit}`);
    if (!currentQueue) {
      let queueKey = orderQueue.store(`${payload.queueId}-${payload.currentEmit}`, new Queue());
      currentQueue = orderQueue.read(queueKey);
    }
    currentQueue.store(payload.orderId, payload);
    socket.broadcast.emit('ORDER-READY', payload);
  });

  socket.on('ORDER-COMPLETE', (payload)=>{
    let prevQueue = orderQueue.read(`${payload.queueId}-ORDER-READY`);
    let currentQueue = orderQueue.read(`${payload.queueId}-${payload.currentEmit}`);
    prevQueue.remove(payload.orderId);
    if (!currentQueue) {
      let queueKey = orderQueue.store(`${payload.queueId}-${payload.currentEmit}`, new Queue());
      currentQueue = orderQueue.read(queueKey);
    }
    currentQueue.store(payload.orderId, payload);
    socket.broadcast.emit('ORDER-COMPLETE', payload);
  });

  socket.on('ORDER-DELIVERED', (payload)=>{
    console.log('[server/index.js 35]', payload);
    let currentQueue = orderQueue.read(`${payload.queueId}-ORDER-COMPLETE`);
    if(!currentQueue){
      throw new Error(`we have orders but no queue`);
    }
    let order = currentQueue.remove(payload.orderId);
    // socket.broadcast.emit('DELIVERED', order);
    console.log(`[server/index.js 42] ${payload.customer} RECEIVED-ORDER ${order}`);
  });

  socket.on('GET-ORDERS', (payload) => {
    console.log('[server/index.js 46] orderQueue:', orderQueue);
    console.log('[server/index.js 47] Payload:', payload);
    console.log('[server/index.js 48] attempting to get orders');

    let currentQueue = orderQueue.read(payload.queueId);
    console.log('[server/index.js 51]', currentQueue);
    if (currentQueue && currentQueue.data) {
      Object.keys(currentQueue.data).forEach(orderId => {
        let payload = currentQueue.read(orderId);
        console.log(`${payload.queueId}-${payload.currentEmit}`);
        socket.emit(`${payload.currentEmit}`, payload);
      });
    }
  });

});


server.listen(3001);
