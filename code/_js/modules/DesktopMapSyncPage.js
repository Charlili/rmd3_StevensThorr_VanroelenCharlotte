'use strict';

import SocketPage from './SocketPage';

//import {redirectToPage} from '../helpers/util';

let MIN_WIDTH = 50;
let MAX_WIDTH = 80;
let MIN_HEIGHT = 50;
let MAX_HEIGHT = 80;

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
        context.font = '11px Helvetica';
        context.fillStyle = '#FFF';
        context.fillText(`x: ${rect.x}px`, rect.x + rect.width + 5, rect.y + 11);
        context.fillText(`y: ${rect.y}px`, rect.x + rect.width + 5, rect.y + 22);
        context.fillText(`w: ${rect.width}px`, rect.x + rect.width + 5, rect.y + 44);
        context.fillText(`h: ${rect.height}px`, rect.x + rect.width + 5, rect.y + 55);

        if(
          rect.width >= MIN_WIDTH && rect.width <= MAX_WIDTH &&
          rect.height >= MIN_HEIGHT && rect.width <= MAX_HEIGHT &&
          rect.x > 0 && rect.x <= (canvas.width - rect.width) &&
          rect.y > 0 && rect.y <= (canvas.height - rect.height)
        ){

          this.$meta.innerText = 'Found Color';

          let colorPos = {};

          colorPos.x = rect.x + rect.width/2;
          colorPos.y = rect.y + rect.height/2;

          this.socket.emit('updateMap', colorPos);

        }else{

          this.$meta.innerText = 'Recalibrate';

        }

      });

    });

  }

}
