'use strict';

module.exports.register = (server, options, next) => {

  let io = require('socket.io')(server.listener);
  let Client = require('../models/Client');
  let DeviceTypes = require('../models/DeviceTypes.js');

  let clients = [];

  io.on('connection', socket => {

    console.log(`[Server] New client (${socket.id})`);

    let maxID = 0;

    if(clients.length > 0){
      clients.forEach(client => {
        if(client.id > maxID){
          maxID = client.id;
        }
      });
    }

    //let newClient = Object.assign({}, Client);
    let newClient = new Client(maxID + 1, 'Unknown', socket.id);
    newClient.socketId = socket.id;

    clients.push(newClient);
    //console.log(clients);

    socket.on('setDeviceType', strDeviceType => {

      newClient.type = strDeviceType;
      newClient.devicename = `${strDeviceType}_${newClient.id}`;

    });

    socket.on('setStatus', status => {

      if(newClient.status !== status){
        newClient.status = status;
      }

    });

    socket.on('disconnect', () => {

      clients = clients.filter(
        c => c.socketId !== socket.id
      );

    });

  });

  next();

};

module.exports.register.attributes = {
  name: 'qrcodepairing',
  version: '0.1.0'
};
