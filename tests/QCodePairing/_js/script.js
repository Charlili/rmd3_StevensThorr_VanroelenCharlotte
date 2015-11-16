'use strict';

// some features need the be polyfilled..
// https://babeljs.io/docs/usage/polyfill/

// import 'babel-core/polyfill';
// or import specific polyfills
// import {$} from './helpers/util';

import {mobileCheck, removeByClassName} from './helpers/util';

import Video from './modules/Video';
import Status from '../models/Status';

let socket, qr;
let $video, $meta, $vidElem;
let blnScanned = false;

const initSocket = () => {

  socket = io('http://localhost:3000');

  if(mobileCheck()){
    socket.emit('setDeviceType', 'Mobile');
    socket.on('connect', initScanner);
  }else{
    socket.emit('setDeviceType', 'Desktop');
    socket.on('connect', createQR);
  }

  setStatus(Status.ready);

};

const createQR = () => {

  let $qrcode = document.querySelector('.QRCode');
  $qrcode.setAttribute('src', `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${socket.id}`);

  $meta = document.querySelector('.meta');
  $meta.innerText = `SocketID: ${socket.id} // Open with phone and scan to pair`;

  setStatus('searching');

  socket.on('scannedByPhone', pairedHandler);

};

const pairedHandler = () => {

  console.log('[Desktop] Paired with Phone');

  setStatus('paired');

  $meta.innerText = `Socket_ID: ${socket.id} // Paired with phone`;

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

    $meta.innerText = `Scanned: ${result}`;

  }, true);

  if(blnScanned === false){
    setTimeout(initScanner, 200);
  }

};

const setStatus = status => {

  socket.emit('setStatus', status);

};

const userStream = stream => {

  qr = new QCodeDecoder();

  $meta = document.querySelector('.meta');
  $video = new Video(document.querySelector('.you'));
  $video.showStream(stream);
  $vidElem = $video.getVideoElem();

  //initSocket();
  initScanner();

};

const initBackCamera = (sourceInfos) => {

  let videoSourceID;

  // Loop over videosources to always get the back-camera of the phone
  for (let i = 0; i !== sourceInfos.length; ++i) {
    let sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'video') {
      videoSourceID = sourceInfo.id;
    }
  }

  //console.log(videoSourceID);

  navigator.getUserMedia(
    {video: {optional: [{sourceId: videoSourceID}]}},
    userStream,
    console.error
  );

};

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

  //setStatus('ready');

};

const initDesktop = () => {

  console.log('[Desktop] Intialising for Desktop');

  $meta = document.querySelector('.meta');

  // -!- Update to Templating later ---
  removeByClassName('.mobileView');

  //setStatus('ready');

  initSocket();

};

const init = () => {

  if(mobileCheck()){
    initMobile();
  }else{
    initDesktop();
  }

};

init();
