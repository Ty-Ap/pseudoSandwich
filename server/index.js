'use strict';



const {Server} = require('socket.io');

const server = new Server();

const sand = server.of('/sand');

sand.on('CONNECTION', (socket)=>{
  console.log('connected');
  socket.on('ORDER', (payload)=>{
    socket.broadcast.emit('ORDER', payload);
  });
  socket.on('ORDER-COMPLETE', (payload)=>{
    socket.broadcast.emit('ORDER-COMPLETE', payload);
  });
  socket.on('ORDER-DELIVERED', (payload)=>{
    console.log(`${payload.customer} RECEIVED-ORDER`);
  });

});


server.listen(3001);



