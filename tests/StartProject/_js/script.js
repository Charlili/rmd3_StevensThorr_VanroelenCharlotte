'use strict';

import {mobileCheck, checkUrlPath, getUrlPaths, redirectToPage, numbersFromString, createId, hideAdressBar} from './helpers/util';

import DeviceTypes from '../models/DeviceTypes';

import DesktopPairPage from './modules/DesktopPairPage';
import MobilePairPage from './modules/MobilePairPage';

let socket;
let blnRedirect = false;
let clientDetails;

let desktopPairPage, mobilePairPage;

const initSocket = () => {

  socket = io('192.168.43.35.:3000');
  //socket = io('192.168.0.178.:3000');
  //socket = io('172.30.22.38.:3000');
  //socket = io('10.254.11.196.:3000');

  if(mobileCheck()){
    clientDetails = { deviceType: DeviceTypes.mobile };
    socket.on('clientConnect', initMobile);
  }else{
    clientDetails = { deviceType: DeviceTypes.desktop };
    socket.on('clientConnect', initDesktop);
  }

  if(getUrlPaths().length >= 5 && checkUrlPath('pair') === false){
    clientDetails.refcode = getUrlPaths()[4];
    clientDetails.passcode = numbersFromString(clientDetails.refcode);
    socket.on('createNewClient', createNewClient);
    socket.emit('setClient', clientDetails);
  }else{
    createNewClient();
  }

};

const createNewClient = (redirect=false) => {

  console.log('[Script] Creating new client');

  clientDetails.passcode = Math.floor((Math.random()*8999)+1000);
  clientDetails.refcode = `${createId(1, true)}${clientDetails.passcode}${createId(1, true)}`;

  blnRedirect = redirect;

  socket.emit('createClient', clientDetails);

};

/* --- Desktop ------------------------------------------------------ */

const initDesktop = () => {

  console.log('[Desktop] Intialising for Desktop');

  if(checkUrlPath('d') && blnRedirect === false){

    switch(getUrlPaths()[5]){

    case 'mapsynch':

      //stuff

      break;

    case 'connect':
    case '':
    default:

      desktopPairPage = new DesktopPairPage(socket, clientDetails);
      desktopPairPage.init();

      break;

    }

  }else{

    redirectToPage(`d/${clientDetails.refcode}`);

  }

};

/* --- Mobile ------------------------------------------------------ */

const initMobile = () => {

  //console.log('[Mobile] Intialising for Mobile');

  hideAdressBar();

  if(checkUrlPath('m') && blnRedirect === false){

    switch(getUrlPaths()[5]){

    case 'mapsynch':



      break;

    case 'pair':

      redirectToPage(`m/${clientDetails.refcode}`);

      break;

    case 'connect':
    case '':
    default:

      mobilePairPage = new MobilePairPage(socket, clientDetails, navigator);
      mobilePairPage.init();

      break;

    }

  }else{

    redirectToPage(`m/${clientDetails.refcode}`);

  }

};

/* --- Other ------------------------------------------------------ */

const init = () => {

  console.log('[Init] Initialising...');

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  initSocket();

};

init();
