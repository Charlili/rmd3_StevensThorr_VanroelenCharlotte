'use strict';

import SocketPage from './SocketPage';

//import {redirectToPage} from '../helpers/util';

export default class Mobile3dPage extends SocketPage{

  constructor(socket, clientDetails){

    super(socket);

    // -- Class Variables -------------
    this.clientDetails = clientDetails;
    this.socket = socket;

    // -- Element Variables ----------


    // -- Element Manipulation -------


    // -- Event Handlers -------------


  }

  init(){

    //document.body.querySelectorAll('.controls li').addEventListener('click', this.clickHandler);
    for(let i = 0; i < 4; i++){
      document.body.querySelectorAll('.controls li')[i].addEventListener('click', (e) => this.clickHandler(e));
    }

  }

  clickHandler(e){

    switch (e.currentTarget.getAttribute('alt')) {
    case 'left':
      e.preventDefault();
      this.socket.emit('changeSelectedCodex', 'left');
      break;
    case 'up':
      e.preventDefault();
      //this.rotateX(0.785398);
      this.socket.emit('clickedUI', 0.785398);
      break;
    case 'right':
      e.preventDefault();
      this.socket.emit('changeSelectedCodex', 'right');
      break;
    case 'down':
      e.preventDefault();
      //this.rotateX(-0.785398);
      this.socket.emit('clickedUI', -0.785398);
      break;
    }

  }

}
