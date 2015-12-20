'use strict';

import SocketPage from './SocketPage';

//import {redirectToPage} from '../helpers/util';

export default class MobileMapSyncPage extends SocketPage{

  constructor(socket, clientDetails){

    super(socket);

    // -- Class Variables -------------
    this.clientDetails = clientDetails;
    this.socket = socket;

    // -- Element Variables ----------
    this.$meta = document.querySelector('.meta');
    this.$map = document.querySelector('.map');

    // -- Element Manipulation -------


    // -- Event Handlers -------------
    this.socket.on('updateMapPos', (colorPos) => this.mapUpdateHandler(colorPos));

  }

  init(){

    //console.log('[MobileMapSynch] Colortracking Smartphone');



  }

  mapUpdateHandler(colorPos){

    this.$meta.innerText = `New Position: ${colorPos.x}, ${colorPos.y}`;

    let nX = -1080 + colorPos.x;
    let nY = -colorPos.y;

    this.$map.style.marginLeft = `${nX}px`;
    this.$map.style.marginTop = `${nY}px`;

  }

}
