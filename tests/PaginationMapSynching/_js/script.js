'use strict';

import {mobileCheck, checkUrlPath, getUrlPaths, redirectToPage} from './helpers/util';

import Video from './modules/Video';
import Status from '../models/Status';
import DeviceTypes from '../models/DeviceTypes';

let socket, qr, passcode, refcode;
let $video, $meta, $vidElem;
let blnScanned = false;

const initSocket = () => {

  socket = io('192.168.43.35.:3000');
  //socket = io('192.168.0.178:3000');

  let clientDetails;

  if(mobileCheck()){
    clientDetails = { deviceType: DeviceTypes.mobile };
    socket.on('clientConnect', initMobile);
  }else{
    clientDetails = { deviceType: DeviceTypes.mobile };
    socket.on('clientConnect', initDesktop);
  }

  if(getUrlPaths().length >= 3){
    refcode = getUrlPaths()[2];
    clientDetails.refcode = refcode;
    socket.emit('setClient', clientDetails);
  }else{
    passcode = Math.floor((Math.random()*8999)+1000);
    refcode = `s${passcode}`;
    clientDetails.passcode = passcode;
    clientDetails.refcode = refcode;
    socket.emit('createClient', clientDetails);
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

    switch(getUrlPaths()[3]){

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

    redirectToPage(`d/${refcode}`);

  }

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

  if(checkUrlPath('m')){

    switch(getUrlPaths()[3]){

    case 'home':

      //stuff

      break;

    case '':
    default:

      $meta = document.querySelector('.meta');
      MediaStreamTrack.getSources(initBackCamera);

      break;

    }

  }else{

    redirectToPage(`m/${refcode}`);

  }

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
