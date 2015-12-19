'use strict';


import {mobileCheck} from './helpers/util';

//import Video from './modules/Video';
import Status from '../models/Status';
let helper;
let socket, passcode;
//let tracking = require('tracking');

const initSocket = () => {

  passcode = Math.floor((Math.random()*8999)+1000);
  console.log(passcode);
  //passcode = 1000;
  //socket = io('http://172.30.17.125:3000');
  socket = io('http://192.168.0.177.:3000');

  if(mobileCheck()){
    helper.innerHTML = 'this is a mobile device';
    socket.emit('setDeviceType', 'Mobile');
    socket.on('connect', setMobile);
  }else{
    helper.innerHTML = 'this is a desktop device.';
    socket.emit('setDeviceType', 'Desktop');
    socket.on('connect', setComputer);

  }
  setStatus(Status.ready);

};

const setMobile = () => {
  setStatus('searching');

  let main = document.querySelector('.main');
  main.style.backgroundColor = 'lightblue';


};

const setComputer = () => {
  console.log(socket);

  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var tracker = new tracking.ColorTracker();
  tracking.track('#video', tracker, { camera: true });
  tracker.on('track', function(event) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    event.data.forEach(function(rect) {
      /*if (rect.color === 'custom') {
        rect.color = tracker.customColor;
      }*/
      rect.color = '#FF3FB7';
      context.strokeStyle = rect.color;
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.font = '11px Helvetica';
      context.fillStyle = "#fff";
      context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
      context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
    });
  });
  //initGUIControllers(tracker);


  setStatus('searching');

};

const setStatus = status => {

  socket.emit('setStatus', status);

};

const init = () => {

  helper = document.querySelector('.main p');
  helper.innerHTML = 'initFunction';
  initSocket();

};

init();
