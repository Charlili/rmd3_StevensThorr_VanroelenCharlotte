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
    //this.$meta.innerText = `${this.$objects[1].getAttribute('alt')}`;

    // -- Element Manipulation -------


    // -- Event Handlers -------------
    this.socket.on('updateMapPos', (colorPos) => this.mapUpdateHandler(colorPos));

  }

  init(){

    //console.log('[MobileMapSynch] Colortracking Smartphone');
    /*this.$objects.forEach((value, index)=>{
      value.addEventListener('click', (e) => this.clickedObjectHandler(e));
    });*/
    //document.querySelector('.mobileView').addEventListener('click',(e) => this.clickedObjectHandler(e));
    for(let i = 0;i < 6; i++){
      this.$objects[i].addEventListener('click', (e) => this.clickedObjectHandler(e));
    }
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
    //this.showPuzzle(e.currentTarget.getAttribute('alt'));
  }

  showPuzzle(number){
    //switch(number)
      //andere image puzzle tonen in .puzzle
      //choices aanpassen in .puzzle li
  }

  mapUpdateHandler(colorPos){

    let nX = -2048 + (colorPos.x * 2);
    let nY = -(colorPos.y * 2);

    let minX = 0 - window.innerWidth/2;
    let maxX = -2048 + window.innerWidth/2;
    let minY = 0 - window.innerHeight/2;
    let maxY = -1250 + window.innerHeight/2;

    if(nX <= minX && nX >= maxX){
      this.$map.style.marginLeft = `${nX}px`;
    }
    if(nY <= minY && nY >= maxY){
      this.$map.style.marginTop = `${nY}px`;
    }

    if(colorPos.distance < 1){

      this.$meta.innerText = `Move Closer (${Math.round(colorPos.distance * 100)}%)`;
      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, ${(1 - colorPos.distance) * 1.6})`;

    }else if(colorPos.distance > 1){

      this.$meta.innerText = `Mover Away (${Math.round((1 + (1 - colorPos.distance)) * 100) + 20}%)`;

    }else{

      this.$meta.innerText = `Good Position (100%)`;
      //this.$map.style.transform = `scale(1, 1);`;
      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, 0)`;

    }

  }

}
