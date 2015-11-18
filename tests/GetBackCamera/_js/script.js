'use strict';

// some features need the be polyfilled..
// https://babeljs.io/docs/usage/polyfill/

// import 'babel-core/polyfill';
// or import specific polyfills
// import {$} from './helpers/util';

import Video from './modules/Video';
import Status from '../models/Status';

let socket, peer;
let you/*, stranger*/;

const initSocket = () => {

  socket = io('http://localhost:3000');

  socket.on('connect', initPeer);
  /*socket.on('found', found);*/
  setStatus(Status.ready);

};

const initPeer = () => {

  peer = new Peer({
    'key': 'zor0hfk2x340a4i'
  });

  peer.on('open', peerId => {

    console.log(`peer connected: ${peerId}`);

    socket.emit('peerId', peerId);
    you.setMeta(`PeerID: ${peerId} | Searching for QR Code`);
    setStatus(Status.searching);

  });

  /*peer.on('call', call => {

    call.answer(you.stream);
    call.on('stream', strangerStream);
    call.on('close', closedStream);

  });*/

};

/*const closedStream = () => {

  stranger.removeStream();
  setStatus(Status.searching);

};*/

/*const strangerStream = stream => {

  stranger.showStream(stream);
  setStatus(Status.streaming);

};*/

/*const found = peerId => {

  //console.log('found partner: ', peerId);

  let call = peer.call(peerId, you.stream);
  call.on('stream', strangerStream);

};*/

const setStatus = status => {

  socket.emit('status', status);

};

const userStream = stream => {

  //console.log(stream);

  you = new Video(document.querySelector('.you'));
  //stranger = new Video(document.querySelector('.stranger'));

  you.showStream(stream);

  initSocket();

};

const initBackCamera = (sourceInfos) => {

  let videoSourceID;

  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'video') {
      videoSourceID = sourceInfo.id;
    }
  }

  console.log(videoSourceID);

  navigator.getUserMedia(
    {video: {optional: [{sourceId: videoSourceID}]}},
    userStream,
    console.error
  );

};

const init = () => {

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  MediaStreamTrack.getSources(initBackCamera);

  /*navigator.getUserMedia(
    {video: true},
    userStream,
    console.error
  );*/

};

init();
