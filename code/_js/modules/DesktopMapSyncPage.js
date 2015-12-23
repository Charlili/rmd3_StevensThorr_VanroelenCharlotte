'use strict';

import SocketPage from './SocketPage';

import {redirectToPage} from '../helpers/util';

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
    this.foundCodexes = 0;

    // -- Element Variables ----------
    this.$meta = document.querySelector('.meta');
    this.$puzzleInfo = document.querySelector('.puzzleInfo');
    this.$puzzleImage = document.querySelector('.puzzleImg');
    this.$puzzleTitle = document.querySelector('.puzzleTitle');
    this.$question = document.querySelector('.question');

    // -- Element Manipulation -------


    // -- Event Handlers -------------
    this.socket.on('showPuzzle', (puzzleJSON) => this.showPuzzle(puzzleJSON));
    this.socket.on('rightAnswer', (puzzleId) => this.rightAnswerHandler(puzzleId));
    this.socket.on('wrongAnswer', () => this.wrongAnswerHandler());

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

  showPuzzle(puzzleJSON){

    this.$puzzleImage.setAttribute('src', `../../img/puzzles/${puzzleJSON.image}`);
    this.$puzzleTitle.innerText = puzzleJSON.title;
    this.$question.innerText = puzzleJSON.question;
    this.$puzzleInfo.className = 'puzzleInfo';

  }

  wrongAnswerHandler(){

    this.$puzzleInfo.className = 'puzzleInfo wrongAnswer';

    setTimeout(() => {
      this.$puzzleInfo.className = 'puzzleInfo';
    }, 350);

  }

  rightAnswerHandler(puzzleId){

    let $inventoryCodex = document.querySelector(`.codex${puzzleId}`);
    $inventoryCodex.className = `${puzzleId} found`;

    this.$puzzleInfo.className = 'puzzleInfo correctAnswer';
    this.$puzzleTitle.innerText = 'Correct!';

    setTimeout(() => {

      this.$puzzleInfo.className = 'puzzleInfo hidden';
      this.$puzzleTitle.innerText = 'Solve the Puzzle';

    }, 1200);

    setTimeout(() => {

      if(this.foundCodexes === 6){
        this.socket.emit('foundAllCodexes');
        redirectToPage(`d/${this.clientDetails.refcode}/3d`);
      }

    }, 1500);

    this.foundCodexes++;

    this.socket.emit('addCodexPiece', puzzleId);

  }

}
