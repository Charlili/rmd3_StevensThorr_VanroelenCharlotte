'use strict';

// some features need the be polyfilled..
// https://babeljs.io/docs/usage/polyfill/

// import 'babel-core/polyfill';
// or import specific polyfills
// import {$} from './helpers/util';

import {mobileCheck, removeByClassName} from './helpers/util';

import Video from './modules/Video';
import Status from '../models/Status';
import DeviceTypes from '../models/DeviceTypes';

let socket, qr;
let $video, $meta, $vidElem;
let blnScanned = false;

const initSocket = () => {

  socket = io('192.168.0.178:3000');

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

  $meta = document.querySelector('.meta');

  // -!- Update to Templating later ---
  removeByClassName('.mobileView');

  createQR();

  setStatus(Status.ready);

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

  // -!- Update to Templating later ---
  removeByClassName('.desktopView');

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

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
    userStream,
    console.error
  );

  setStatus(Status.ready);

};

const userStream = stream => {

  console.log('[Mobile] Intialising Userstreaam');

  qr = new QCodeDecoder();

  $meta = document.querySelector('.meta');
  $video = new Video(document.querySelector('.you'));
  $video.showStream(stream);
  $vidElem = $video.getVideoElem();

  initScanner();

};

const initScanner = () => {

  console.log('[Mobile] Intialising Scanner');

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
    setTimeout(initScanner, 200);
  }

};

const desktopPairedHandler = pairedId => {

  $meta.innerText = `Paired with: ${pairedId}`;

};

/* --- Other ------------------------------------------------------ */

/*const init = () => {

  initSocket();

};*/

//init();
initSocket();
