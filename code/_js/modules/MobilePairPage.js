'use strict';

import SocketPage from './SocketPage';
import Video from './Video';
import Status from '../../models/Status';

import {redirectToPage, numbersFromString, replaceCharAt} from '../helpers/util';

//let socket;

export default class MobilePairPage extends SocketPage{

  constructor(socket, clientDetails, navigator){

    super(socket);

    // -- Class Variable -------------
    this.clientDetails = clientDetails;
    this.navigator = navigator;
    this.blnScanned = false;
    this.codexpass = 'XXXX';

    // -- Element Variables ----------
    this.$meta = document.querySelector('.meta');
    this.$video = new Video(document.querySelector('.you'));

    // -- Event Handlers -------------
    this.socket.on('paired', (pairedid) => this.pairedHandler(pairedid));

    for(let i = 0; i < 4; i++){

      document.getElementsByClassName('upButton')[i].addEventListener('click', evt => {
        this.changePassValue(evt, 1);
      });

      document.getElementsByClassName('downButton')[i].addEventListener('click', evt => {
        this.changePassValue(evt, -1);
      });

    }

  }

  init(){

    MediaStreamTrack.getSources(this.initBackCamera);

  }

  changePassValue(evt, direction){

    console.log('[MobilePairPage] Changing Codex Pair/Passcode Value');

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

    this.codexpass = replaceCharAt(String(this.codexpass), index, String(newValue));

    if(numbersFromString(this.codexpass).length === 4){
      this.socket.emit('checkCode', Number(this.codexpass));
    }

  }

  initBackCamera(sourceInfos){

    console.log('[MobilePairPage] Intialising Back Camera');

    this.$meta.innerText = `Initialising Back Camera`;

    // Loop over videosources to always get the back-camera of the phone
    let videoSourceID;
    for (let i = 0; i !== sourceInfos.length; ++i) {
      let sourceInfo = sourceInfos[i];
      if (sourceInfo.kind === 'video') {
        videoSourceID = sourceInfo.id;
      }
    }

    this.navigator.getUserMedia(
      {video: {optional: [{sourceId: videoSourceID}]}},
      this.backcamStream,
      console.error
    );

    super.setStatus(Status.ready);

  }

  backcamStream(stream){

    console.log('[MobilePairPage] Intialising Userstreaam');

    this.qr = new QCodeDecoder();

    this.$video.showStream(stream);
    this.$vidElem = this.$video.getVideoElem();

    this.initQCodeScan();

  }

  initQCodeScan(){

    console.log('[MobilePairPage] Intialising Scanner');

    super.setStatus('searching');

    this.$meta.innerText = `Searching...`;

    this.qr.decodeFromVideo(this.$vidElem, (err, result) => {

      if (err) throw err;

      // -!- TODO: Implement socketId validation
      this.socket.emit('setPaired', result);

      this.blnScanned = true;

      this.$meta.innerText = `Scanned: ${result}`;

    }, true);

    if(this.blnScanned === false){
      setTimeout(this.initQCodeScan, 500);
    }

  }

  pairedHandler(pairedId){

    this.$meta.innerText = `Paired with: ${pairedId}`;

    redirectToPage(`m/${this.clientDetails.refcode}/mapsync`);

  }

}
