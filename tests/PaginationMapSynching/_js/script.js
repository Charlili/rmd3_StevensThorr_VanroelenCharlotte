'use strict';

// some features need the be polyfilled..
// https://babeljs.io/docs/usage/polyfill/

// import 'babel-core/polyfill';
// or import specific polyfills
// import {$} from './helpers/util';

import {mobileCheck, checkUrlPath, getUrlPaths, redirectToPage} from './helpers/util';

import Video from './modules/Video';
import Status from '../models/Status';
import DeviceTypes from '../models/DeviceTypes';

let socket, qr, passcode;
let $video, $meta, $vidElem;
let blnScanned = false;

const initSocket = () => {

  //console.log('socket:', socket, 'io:', io);

  if(getUrlPaths().length >= 3){
    passcode = getUrlPaths()[2];
  }else{
    passcode = Math.floor((Math.random()*8999)+1000);
  }

  console.log('Passcode', passcode);

  socket = io('10.254.11.95.:3000');
  //socket = io('192.168.0.178:3000');

  if(mobileCheck()){
    socket.emit('setDeviceType', DeviceTypes.mobile);
    socket.on('connect', initMobile);
  }else{
    socket.emit('setDeviceType', DeviceTypes.desktop);
    socket.on('connect', initDesktop);
  }

  setStatus(Status.not_ready);

};

const setStatus = status => {

  socket.emit('setStatus', status);

};

/* --- Desktop ------------------------------------------------------ */

const initDesktop = () => {

  console.log('[Desktop] Intialising for Desktop');

  console.log('Desktop? = ', checkUrlPath('d'));
  console.log('Hashes: ', getUrlPaths());

  $meta = document.querySelector('.meta');

  if(checkUrlPath('d')){

    switch(getUrlPaths()[2]){
    case 'home':
      //stuff
      break;
    case '':
    default:
      createQR();
      setStatus(Status.ready);
      break;
    }

  }else{

    redirectToPage(`d/${passcode}`);

  }

  //createQR();
  //setStatus(Status.ready);

};

const createQR = () => {

  console.log('[Desktop] Creating QR Code');

  let $qrcode = document.querySelector('.QRCode');
  $qrcode.setAttribute('src', `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${socket.id}`);

  $meta = document.querySelector('.meta');
  $meta.innerText = `SocketID: ${socket.id} // Open with phone and scan to pair`;

  setStatus('searching');

  socket.on('paired', phonePairedHandler);

};

const phonePairedHandler = pairedId => {

  console.log('[Desktop] Paired with Phone');

  socket.emit('setPaired', pairedId);

  setStatus('paired');

  $meta.innerText = `Socket_ID: ${socket.id} // Paired with: ${pairedId}`;

};

/* --- Mobile ------------------------------------------------------ */

const initMobile = () => {

  console.log('[Mobile] Intialising for Mobile');



  $meta = document.querySelector('.meta');

  MediaStreamTrack.getSources(initBackCamera);

};

const initBackCamera = (sourceInfos) => {

  console.log('[Mobile] Intialising Back Camera');

  let videoSourceID;

  // Loop over videosources to always get the back-camera of the phone
  for (let i = 0; i !== sourceInfos.length; ++i) {
    let sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'video') {
      videoSourceID = sourceInfo.id;
    }
  }

  navigator.getUserMedia(
    {video: {optional: [{sourceId: videoSourceID}]}},
    backcamStream,
    console.error
  );

  setStatus(Status.ready);

};

const backcamStream = stream => {

  console.log('[Mobile] Intialising Userstreaam');

  qr = new QCodeDecoder();

  $meta = document.querySelector('.meta');
  $video = new Video(document.querySelector('.you'));
  $video.showStream(stream);
  $vidElem = $video.getVideoElem();

  initQCodeScan();

};

const initQCodeScan = () => {

  //console.log('[Mobile] Intialising Scanner');

  setStatus('searching');

  $meta.innerText = `Searching...`;

  qr.decodeFromVideo($vidElem, (err, result) => {

    if (err) throw err;

    // -!- TODO: Implement socketId validation
    socket.emit('setPaired', result);

    blnScanned = true;

    socket.on('paired', desktopPairedHandler);

    $meta.innerText = `Scanned: ${result}`;

  }, true);

  if(blnScanned === false){
    setTimeout(initQCodeScan, 200);
  }

};

const desktopPairedHandler = pairedId => {

  $meta.innerText = `Paired with: ${pairedId}`;

};

/* --- Map Synching ----------------------------------------------- */



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
//initSocket();
