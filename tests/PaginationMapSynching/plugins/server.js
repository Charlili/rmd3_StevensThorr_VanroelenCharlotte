'use strict';

module.exports.register = (server, options, next) => {

  let io = require('socket.io')(server.listener);
  let Client = require('../models/Client');
  let DeviceTypes = require('../models/DeviceTypes.js');

  let clients = [];
  let prevClients = [];

  io.on('connection', socket => {

    let maxID = 0;
    if(assocLength(clients) > 0){
      for(let key in clients){
        let client = clients[key];
        if(client.id > maxID){
          maxID = client.id;
        }
      }
    }

    let newClient = new Client(maxID + 1, 'Unknown', socket.id);

    socket.on('createClient', clientInfo => {

      console.log(`[Server] New client (${clientInfo.refcode} / ${socket.id})`);

      newClient = new Client(maxID + 1, 'Unknown', socket.id);

      newClient.socketid = socket.id;
      newClient.type = clientInfo.deviceType;
      newClient.passcode = clientInfo.passcode;
      newClient.refcode = clientInfo.refcode;

      clients[clientInfo.refcode] = newClient;
      socket.emit('clientConnect');

    });

    socket.on('setClient', clientInfo => {

      newClient = prevClients[clientInfo.refcode];

      if(typeof newClient === 'undefined'){

        console.log(`[Server] Failed to recycle (${newClient})`);

        socket.emit('createNewClient', true);

      }else{

        console.log(`[Server] Recycled client (${newClient.refcode})`);

        delete prevClients[newClient.refcode];

        newClient.socketid = socket.id;
        newClient.type = clientInfo.deviceType;

        if(typeof clients[newClient.pairedref] !== 'undefined'){
          newClient.pairedid = clients[newClient.pairedref].socketid;
          //console.log(`[Server] NewClient: {${newClient.refcode} / ${newClient.socketid}} | PairedClient: {${newClient.pairedref} / ${newClient.pairedid}}`);
        }

        clients[clientInfo.refcode] = newClient;
        socket.emit('clientConnect');

      }

    });

    /* --- Event Handlers ---------------------------------------------- */

    socket.on('checkCode', codexcode => {

      for(let key in clients){

        let client = clients[key];

        if(client.passcode === codexcode){

          console.log(`[Server] Right code ${codexcode}`);

          newClient.pairedid = client.socketid;
          client.pairedid = newClient.socketid;
          newClient.pairedref = client.refcode;

          io.to(newClient.pairedid).emit('paired', socket.id);
          socket.emit('paired', client.refcode);

          console.log(`[Server] Paired Clients {${client.refcode} / ${client.socketid} / ${client.passcode}} and {${newClient.refcode} / ${newClient.socketid}}`);

        }

      }

    });

    socket.on('setDeviceType', deviceType => {

      newClient.type = deviceType;

      let strDeviceType = 'Unknown';
      if(deviceType === DeviceTypes.mobile){
        strDeviceType = 'Mobile';
      }else if(deviceType === DeviceTypes.desktop){
        strDeviceType = 'Desktop';
      }

      newClient.devicename = `${strDeviceType}_${newClient.id}`;

    });

    socket.on('setPaired', pairedId => {

      if(newClient.type === DeviceTypes.mobile){
        io.to(pairedId).emit('paired', socket.id);
        socket.emit('paired', pairedId);
      }

      for(let key in clients){
        let client = clients[key];
        if(client.socketid === pairedId){
          newClient.pairedref = client.refcode;
        }
      }

      newClient.pairedid = pairedId;

    });

    socket.on('setStatus', status => {

      if(newClient.status !== status){
        newClient.status = status;
      }

    });

    socket.on('disconnect', () => {

      console.log(`[Server] Client (${newClient.refcode} / ${newClient.socketid}) has left...`);

      prevClients[newClient.refcode] = newClient;

      delete clients[newClient.refcode];

    });

  });

  const assocLength = arr => {

    let arrLength = 0;
    for(let key in arr){
      key = key;
      arrLength++;
    }
    return arrLength;

  };

  next();

};

module.exports.register.attributes = {
  name: 'qrcodepairing',
  version: '0.1.0'
};
