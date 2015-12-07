'use strict';

import {mobileCheck, checkUrlPath, getUrlPaths, redirectToPage, numbersFromString, replaceCharAt, createId} from './helpers/util';

import Video from './modules/Video';
import Status from '../models/Status';
import DeviceTypes from '../models/DeviceTypes';

let socket, qr, passcode, refcode, codexpass;
let $video, $meta, $vidElem;
let blnScanned = false;
let blnRedirect = false;
let clientDetails;

const initSocket = () => {

  //socket = io('192.168.43.35.:3000');
  socket = io('192.168.0.178.:3000');

  if(mobileCheck()){
    clientDetails = { deviceType: DeviceTypes.mobile };
    socket.on('clientConnect', initMobile);
    socket.on('paired', desktopPairedHandler);
  }else{
    clientDetails = { deviceType: DeviceTypes.desktop };
    socket.on('clientConnect', initDesktop);
    socket.on('paired', phonePairedHandler);
  }

  if(getUrlPaths().length >= 5 && checkUrlPath('pair') === false){
    refcode = getUrlPaths()[4];
    passcode = numbersFromString(refcode);
    clientDetails.refcode = refcode;
    socket.on('createNewClient', createNewClient);
    socket.emit('setClient', clientDetails);
  }else{
    createNewClient();
  }

  socket.on('PaginationRePair', paginationRePairHandler);

};

const createNewClient = (redirect=false) => {

  console.log('[Script] Creating new client');

  passcode = Math.floor((Math.random()*8999)+1000);
  refcode = `${createId(1)}${passcode}${createId(1)}`;
  clientDetails.passcode = passcode;
  clientDetails.refcode = refcode;

  blnRedirect = redirect;

  socket.emit('createClient', clientDetails);

};

const paginationRePairHandler = pairedRef => {

  console.log('[Script] Re Pairing Clients');

  socket.emit('rePair', pairedRef);

};

const setStatus = status => {

  socket.emit('setStatus', status);

};

/* --- Desktop ------------------------------------------------------ */

const initDesktop = () => {

  console.log('[Desktop] Intialising for Desktop');

  $meta = document.querySelector('.meta');

  if(checkUrlPath('d') && blnRedirect === false){

    switch(getUrlPaths()[5]){

    case 'home':

      //stuff

      break;

    case 'connect':
    case '':
    default:

      document.querySelector('.passcode').innerText = passcode;

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

  $meta.innerText = `SocketID: ${socket.id} // Open with phone and scan to pair`;

  setStatus('searching');

};

const phonePairedHandler = pairedId => {

  console.log('[Desktop] Paired with Phone');

  socket.emit('setPaired', pairedId);

  setStatus('paired');

  $meta.innerText = `Socket_ID: ${socket.id} // Paired with: ${pairedId}`;

};

/* --- Mobile ------------------------------------------------------ */

const initMobile = () => {

  //console.log('[Mobile] Intialising for Mobile');

  $meta = document.querySelector('.meta');

  if(checkUrlPath('m') && blnRedirect === false){

    switch(getUrlPaths()[5]){

    case 'home':

      //stuff

      break;

    case 'pair':

      redirectToPage(`m/${refcode}`);

      break;

    case 'connect':
    case '':
    default:

      codexpass = 'XXXX';

      for(let i = 0; i < 4; i++){
        document.getElementsByClassName('upButton')[i].addEventListener('click', evt => { changePassValue(evt, 1); });
        document.getElementsByClassName('downButton')[i].addEventListener('click', evt => { changePassValue(evt, -1); });
      }

      MediaStreamTrack.getSources(initBackCamera);

      break;

    }

  }else{

    redirectToPage(`m/${refcode}`);

  }

};

const changePassValue = (evt, direction) => {

  //console.log('[Script] Changing Codex Pair/Passcode Value');

  let $codexTicker = evt.target.parentNode;
  let index = Number(numbersFromString($codexTicker.getAttribute('id'))) -1;

  let $rowValue = document.getElementsByClassName('rowValue')[index];
  let value = $rowValue.innerHTML;

  if(value === 'X'){
    value = 0;
  }else{
    value = Number(value);
  }

  let newValue;
  if(direction < 0 && value <= 0){
    newValue = 9;
  }else if(direction > 0 && value >= 9){
    newValue = 0;
  }else{
    newValue = value + direction;
  }

  $rowValue.innerText = newValue;

  codexpass = replaceCharAt(String(codexpass), index, String(newValue));

  //$meta.innerText = `Incomplete code: ${numbersFromString(codexpass)}`;

  if(numbersFromString(codexpass).length === 4){
    $meta.innerText = `Complete code: ${numbersFromString(codexpass).length}`;
    socket.emit('checkCode', Number(codexpass));
  }else{
    $meta.innerText = `Incomplete code: ${numbersFromString(codexpass).length}`;
  }

};

const initBackCamera = (sourceInfos) => {

  //console.log('[Mobile] Intialising Back Camera');

  $meta.innerText = `Initialising Back Camera`;

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

  //console.log('[Mobile] Intialising Userstreaam');

  qr = new QCodeDecoder();

  //$meta = document.querySelector('.meta');
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

    $meta.innerText = `Scanned: ${result}`;

  }, true);

  if(blnScanned === false){
    setTimeout(initQCodeScan, 500);
  }

};

const desktopPairedHandler = pairedId => {

  //console.log('[Server] Paired 3 ---------');

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
