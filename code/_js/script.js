'use strict';

import {mobileCheck, checkUrlPath, getUrlPaths, redirectToPage, numbersFromString, createId, hideAdressBar} from './helpers/util';

import DeviceTypes from '../models/DeviceTypes';

import DesktopPairPage from './modules/DesktopPairPage';
import DesktopMapSyncPage from './modules/DesktopMapSyncPage';
import Desktop3dPage from './modules/Desktop3dPage';
import MobilePairPage from './modules/MobilePairPage';
import MobileMapSyncPage from './modules/MobileMapSyncPage';
import Mobile3dPage from './modules/Mobile3dPage';

import Intro from './modules/1_Intro';

let socket;
let blnRedirect = false;
let clientDetails;

let desktopPairPage, mobilePairPage;
let desktopMapSyncPage, mobileMapSyncPage;
let desktop3dPage, mobile3dPage;

const initSocket = () => {

  //socket = io('192.168.43.35.:3000');
  //socket = io('192.168.0.178.:3000');
  //socket = io('172.30.22.38.:3000');
  //socket = io('172.30.22.16.:3000');
  //socket = io('10.254.11.196.:3000');
  socket = io('192.168.0.198.:3000');
  //socket = io('192.168.0.177.:3000');

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

  if(checkUrlPath('d') && blnRedirect === false){

    switch(getUrlPaths()[5]){

    case 'mapsync':

      console.log('[Desktop] Syncing Maps...', getUrlPaths()[5]);

      desktopMapSyncPage = new DesktopMapSyncPage(socket, clientDetails);
      desktopMapSyncPage.init();

      break;

    case '3d':
      console.log('[Desktop] Syncing Maps...', getUrlPaths()[5]);

      desktop3dPage = new Desktop3dPage(socket, clientDetails);
      desktop3dPage.init();
      break;

    case 'connect':
    case '':
    default:

      console.log('[Desktop] Intialising...');

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

  hideAdressBar();

  if(checkUrlPath('m') && blnRedirect === false){

    switch(getUrlPaths()[5]){

    case 'mapsync':

      mobileMapSyncPage = new MobileMapSyncPage(socket, clientDetails);
      mobileMapSyncPage.init();

      break;

    case 'pair':

      redirectToPage(`m/${clientDetails.refcode}`);

      break;

    case '3d':
      console.log('[Mobile] Syncing 3D...', getUrlPaths()[5]);

      mobile3dPage = new Mobile3dPage(socket, clientDetails);
      mobile3dPage.init();
      break;

    case 'connect':
    case '':
    default:

      //console.log('[Mobile] Intialising...');

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
  let intro;

  if(mobileCheck()){
    scan();
  }else{
    if(checkUrlPath('intro')){
      console.log(getUrlPaths()[3]);
      intro = new Intro(document.querySelector('.intro'));
      intro.init();
    }else{
      if(getUrlPaths()[3] === '')redirectToPage('intro');
      else scan();
    }
  }
};
const scan = () => {

  console.log('[Init] Initialising...');

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  initSocket();

};

init();
