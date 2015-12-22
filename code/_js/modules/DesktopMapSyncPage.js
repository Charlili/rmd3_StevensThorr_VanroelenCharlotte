'use strict';

import SocketPage from './SocketPage';

//import {redirectToPage} from '../helpers/util';

let MIN_AXIS = 40;
let MAX_AXIS = 140;

let PREF_MIN = 70;
let PREF_MAX = 100;

export default class DesktopMapSyncPage extends SocketPage{

  constructor(socket, clientDetails){

    super(socket);

    // -- Class Variables -------------
    this.clientDetails = clientDetails;
    this.socket = socket;

    // -- Element Variables ----------
    this.$meta = document.querySelector('.meta');

    // -- Element Manipulation -------


    // -- Event Handlers -------------


  }

  init(){

    console.log('[DesktopMapSync] Colortracking Smartphone');

    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');

    let context = canvas.getContext('2d');
    let tracker = new tracking.ColorTracker();

    tracking.track(video, tracker, { camera: true });

    tracker.on('track', event => {

      context.clearRect(0, 0, canvas.width, canvas.height);

      event.data.forEach( (rect) => {

        rect.color = '#FF3FB7';
        context.strokeStyle = rect.color;
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);

        let checkAxis = rect.height;
        if(rect.width > rect.height){
          checkAxis = rect.width;
        }

        if(
          checkAxis >= MIN_AXIS && checkAxis <= MAX_AXIS &&
          rect.x > 0 && rect.x <= (canvas.width - rect.width) &&
          rect.y > 0 && rect.y <= (canvas.height - rect.height)
        ){

          let colorPos = {};

          this.$meta.innerText = 'Tracking Smartphone';

          if(checkAxis < PREF_MIN){
            colorPos.distance = checkAxis/PREF_MIN;
          }else if(checkAxis > PREF_MAX){
            colorPos.distance = checkAxis/PREF_MAX;
          }else{
            colorPos.distance = 1;
          }

          colorPos.x = rect.x + rect.width/2;
          colorPos.y = rect.y + rect.height/2;

          this.socket.emit('updateMap', colorPos);

        }else{

          this.$meta.innerText = 'Move phone to center';

        }

      });

    });

  }

}
