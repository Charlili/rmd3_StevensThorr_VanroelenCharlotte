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
    this.$lightOverlay = document.querySelector('.lightOverlay');
    this.$objects = document.querySelectorAll('.map li');

    // -- Element Manipulation -------


    // -- Event Handlers -------------
    this.socket.on('updateMapPos', (colorPos) => this.mapUpdateHandler(colorPos));

  }

  init(){

    //console.log('[MobileMapSynch] Colortracking Smartphone');
    /*this.$objects.forEach((index, value)=>{
      value.addEventListener('click', (evt) => this.clickedObjectHandler(evt));
    });*/
    document.querySelector('.map').addEventListener('click', (evt) => this.clickedMapHandler(evt));

  }

  clickedMapHandler(evt){

    console.log('Clicked:', evt);
    this.$meta.innerText = 'Clicked an object!';

    document.querySelectorAll('.map li').addEventListener('click touchstart', this.clickedObjectHandler);

  }

  clickedObjectHandler(e){
    e.currentTarget.style.display = 'none';
  }

  mapUpdateHandler(colorPos){

    //this.$meta.innerText = `New Position: ${colorPos.x}, ${colorPos.y}`;

    let nX = -1080 + colorPos.x;
    let nY = -colorPos.y;

    this.$map.style.marginLeft = `${nX}px`;
    this.$map.style.marginTop = `${nY}px`;

    if(colorPos.distance < 1){

      this.$meta.innerText = `Move closer to screen (${colorPos.distance * 100}%)`;

      this.$map.style.transform = `scale(${colorPos.distance}, ${colorPos.distance});`;
      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, ${(1 - colorPos.distance)*2})`;

    }else if(colorPos.distance > 1){

      this.$meta.innerText = `Move farther away (${Math.round((1 + (1 - colorPos.distance)) * 100) + 20}%)`;

      this.$map.style.transform = `scale(${colorPos.distance}, ${colorPos.distance});`;
      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, 0)`;

    }else{

      this.$meta.innerText = `Excellent Distance (100%)`;

      this.$map.style.transform = `scale(1, 1);`;
      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, 0)`;

    }

  }

}
