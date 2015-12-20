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

    //this.$meta.innerText = `New Position: ${colorPos.x}, ${colorPos.y}`;

    let nX = -1080 + colorPos.x;
    let nY = -colorPos.y;



    this.$map.style.marginLeft = `${nX}px`;
    this.$map.style.marginTop = `${nY}px`;

  }

}
