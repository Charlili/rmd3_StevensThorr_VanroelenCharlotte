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
      console.log(`[Server] Previous Clients(${prevClients.length}): ${prevClients}`);

      newClient = new Client(maxID + 1, 'Unknown', socket.id);

      newClient.socketid = socket.id;
      newClient.type = clientInfo.deviceType;
      newClient.passcode = clientInfo.passcode;
      newClient.refcode = clientInfo.refcode;

      //clients[clientInfo.refcode] = newClient;
      clients.push(newClient);
      console.log(`[Server] Clients(${clients.length}): ${clients}`);
      console.log(`[Server] Previous Clients(${prevClients.length}): ${prevClients}`);
      socket.emit('clientConnect');

    });

    socket.on('setClient', clientInfo => {

      newClient = prevClients[clientInfo.refcode];

      if(typeof newClient === 'undefined'){

        console.log(`[Server] Failed to recycle (${newClient})`);

        socket.emit('createNewClient', true);

      }else{

        console.log(`[Server] Recycled client (${newClient.refcode})`);
        console.log(`[Server] Previous Clients(${prevClients.length}): ${prevClients}`);

        prevClients = prevClients.filter(
          c => c.refcode !== clientInfo.refcode
        );

        newClient.socketid = socket.id;
        newClient.type = clientInfo.deviceType;

        console.log(`[Server] PairedId: ${newClient.pairedid}`);
        io.to(newClient.pairedid).emit('PaginationRePair', newClient.refcode);

        //clients[clientInfo.refcode] = newClient;
        clients.push(newClient);
        console.log(`[Server] Clients(${clients.length}): ${clients}`);
        console.log(`[Server] Previous Clients(${prevClients.length}): ${prevClients}`);
        socket.emit('clientConnect');

      }

    });

    /* --- Event Handlers ---------------------------------------------- */

    socket.on('rePair', pairedRef => {

      console.log(`[Server] Re - pairing clients {${newClient.refcode} / ${newClient.socketid}} and {${clients[pairedRef].refcode} / ${clients[pairedRef].socketid}}`);

      newClient.pairedid = clients[pairedRef].socketid;

    });

    socket.on('checkCode', codexcode => {

      console.log(`[Server] Checking passcode ${codexcode}`);

      if(clients.length > 0){

        console.log(`[Server] Search match passcode ${codexcode}`);

        clients.forEach( client => {

          console.log(`[Server] Checking Client {${client.refcode} / ${client.socketid} / ${client.passcode}} and {${newClient.refcode} / ${newClient.socketid} / ${codexcode}}`);

          if(client.passcode === codexcode && client.pairedid !== ''){

            console.log('[Server] Right code');

            newClient.pairedid = client.socketid;
            client.pairedid = newClient.socketid;

            io.to(newClient.pairedid).emit('paired', socket.id);
            socket.emit('pairedWithCode', socket.id);

          }

        });

      }

    });

    socket.on('setDeviceType', strDeviceType => {

      newClient.type = strDeviceType;
      newClient.devicename = `${strDeviceType}_${newClient.id}`;

    });

    socket.on('setPaired', pairedId => {

      if(newClient.type === DeviceTypes.mobile){
        io.to(pairedId).emit('paired', socket.id);
        socket.emit('paired', pairedId);
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
