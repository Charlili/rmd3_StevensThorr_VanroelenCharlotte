'use strict';

module.exports.register = (server, options, next) => {

  let io = require('socket.io')(server.listener);
  let Status = require('../models/Status');

  let client = require('../models/client');

  //console.log(Status);

  let clients = [];

  const search = socket => {

    //console.log(socket.id, 'is searching');

    let you = clients.find(c => c.socketId === socket.id);

    if(you === undefined || you.status !== Status.searching) return;

    let list = clients.filter(
      c => c.socketId !== you.socketId
        && c.status === Status.searching
    );

    if(list.length === 0){
      //console.log('Text');
      setTimeout(search, 2000, you, socket);
    }else{
      console.log('found', list);

      let stranger = list[Math.round(Math.random() * (list.length-1))];

      you.status = Status.paired;
      stranger.status = Status.paired;

      socket.emit('found', stranger.peerId);

    }

  };

  io.on('connection', socket => {

    console.log(Status);

    let newClient = Object.assign({ok: 'test'}, client);
    newClient.socketId = socket.id;
    //console.log(newClient);

    clients.push(newClient);

    console.log(clients);

    socket.on('disconnect', () => {

      clients = clients.filter(
        c => c.socketId !== socket.id
      );

    });

    socket.on('peerId', peerId => {

      newClient.peerId = peerId;

    });

    socket.on('status', status => {

      if(newClient.status !== status){
        newClient.status = status;
      }

      if(newClient.status === Status.searching){
        search(socket);
      }

    });

  });

  next();

};

module.exports.register.attributes = {
  name: 'devineroulette',
  version: '0.1.0'
};
