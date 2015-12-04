'use strict';

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

import {mobileCheck, removeByClassName} from './helpers/util';

//import Video from './modules/Video';
import Status from '../models/Status';
let helper;
let socket, passcode;

const initSocket = () => {

  passcode = Math.floor((Math.random()*8999)+1000);
  console.log(passcode);
  //passcode = 1000;
  socket = io('http://172.30.17.125:3000');

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
