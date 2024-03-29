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

    socket.on('checkCode', (codeMobile) => {

        console.log(codeMobile);
        if(clients.length > 0){
          clients.forEach(client => {
            if(client.code === codeMobile && !client.pairedId){
              console.log('right code');
              newClient.pairedId = client.socketId;
              client.pairedId = newClient.socketId;
              //console.log(clients);
              io.to(newClient.pairedId).emit('pairedDesktop', socket.id);
              io.emit('pairedMobile', socket.id);
              //io.emit('paired',socket.id);

            }else{
              console.log('wrong code');
            }
          });
        }


    });

    socket.on('setPaired', pairedId => {

      if(newClient.type === DeviceTypes.mobile){
        io.to(pairedId).emit('paired', socket.id);
      }

      newClient.pairedId = pairedId;

    });

    socket.on('setCode', code => {
      //console.log(code);
      newClient.code = code;
      console.log(newClient);

    });

    socket.on('clickedUI', increment => {
      //console.log(code);
      io.to(newClient.pairedId).emit('clickedUI', increment);

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
