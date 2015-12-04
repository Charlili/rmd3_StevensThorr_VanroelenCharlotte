'use strict';

module.exports.register = (server, options, next) => {

  let io = require('socket.io')(server.listener);
  let Client = require('../models/Client');
  let DeviceTypes = require('../models/DeviceTypes.js');

  let clients = [];
  let prevClients = [];

  io.on('connection', socket => {

    let maxID = 0;
    if(clients.length > 0){
      clients.forEach(client => {
        if(client.id > maxID){
          maxID = client.id;
        }
      });
    }

    let newClient = new Client(maxID + 1, 'Unknown', socket.id);

    socket.on('createClient', clientInfo => {

      console.log(`[Server] New client (${clientInfo.refcode} / ${socket.id})`);

      newClient = new Client(maxID + 1, 'Unknown', socket.id);

      newClient.socketId = socket.id;
      newClient.deviceType = clientInfo.deviceType;
      newClient.passcode = clientInfo.passcode;
      newClient.refcode = clientInfo.refcode;

      clients[clientInfo.refcode] = newClient;
      socket.emit('clientConnect');

    });

    socket.on('setClient', clientInfo => {

      newClient = prevClients[clientInfo.refcode];

      prevClients = prevClients.filter(
        c => c.refcode !== clientInfo.refcode
      );

      console.log(newClient.socketid);
      newClient.socketid = socket.id;
      newClient.deviceType = clientInfo.deviceType;
      console.log(newClient.socketid);

      clients[clientInfo.refcode] = newClient;
      socket.emit('clientConnect');

    });

    /* --- Event Handlers ---------------------------------------------- */

    socket.on('setDeviceType', strDeviceType => {

      newClient.type = strDeviceType;
      newClient.devicename = `${strDeviceType}_${newClient.id}`;

    });

    socket.on('setPaired', pairedId => {

      if(newClient.type === DeviceTypes.mobile){
        io.to(pairedId).emit('paired', socket.id);
        socket.emit('paired', pairedId);
      }

      newClient.pairedId = pairedId;

    });

    socket.on('setStatus', status => {

      if(newClient.status !== status){
        newClient.status = status;
      }

    });

    socket.on('disconnect', () => {

      console.log(`[Server] Client (${newClient.refcode} / ${newClient.socketid}) has left...`);

      prevClients[newClient.refcode] = newClient;

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
