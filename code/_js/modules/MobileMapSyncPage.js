'use strict';

import SocketPage from './SocketPage';

import {httpGetAsync, redirectToPage} from '../helpers/util';

export default class MobileMapSyncPage extends SocketPage{

  constructor(socket, clientDetails){

    super(socket);

    // -- Class Variables -------------
    this.clientDetails = clientDetails;
    this.socket = socket;
    this.curPuzzleId = 0;

    // -- Element Variables ----------
    this.$meta = document.querySelector('.meta');
    this.$map = document.querySelector('.map');
    this.$lightOverlay = document.querySelector('.lightOverlay');
    this.$objects = document.querySelectorAll('.map li');
    this.$puzzle = document.querySelector('.puzzle');
    this.$answerList = document.querySelector('.puzzle ul');

    // -- Element Manipulation -------


    // -- Event Handlers -------------
    this.socket.on('updateMapPos', (colorPos) => this.mapUpdateHandler(colorPos));
    this.socket.on('foundAllCodexes', () => redirectToPage(`m/${this.clientDetails.refcode}/3d`));

  }

  init(){

    //console.log('[MobileMapSynch] Colortracking Smartphone');

    for(let i = 0; i < 6; i++){
      this.$objects[i].addEventListener('click', (e) => this.clickedObjectHandler(e));
    }

  }

  clickedObjectHandler(e){

    e.currentTarget.style.display = 'none';

    this.curPuzzleId = e.currentTarget.getAttribute('puzzleId');

    //this.socket.emit('showPuzzle', puzzleId);

    this.showPuzzle(this.curPuzzleId);

  }

  showPuzzle(puzzleId){

    this.$meta.innerText = `Showing Logic Puzzle ${puzzleId}`;

    this.$puzzle.className = 'puzzle';

    httpGetAsync(`${window.location.href.substr(0, window.location.href.indexOf('/m'))}/api/puzzles/${puzzleId}`, (puzzleJSON) => this.showAnswers(puzzleJSON));

  }

  showAnswers(puzzleJSON){

    let logicPuzzle = JSON.parse(puzzleJSON);

    this.socket.emit('showPuzzle', logicPuzzle);

    this.$meta.innerText = `puzzleImg: ${logicPuzzle.answers.length}`;

    this.$answerList.innerHTML = '';
    for(let i = 0; i < logicPuzzle.answers.length; i++){

      let answerJSON = logicPuzzle.answers[i];
      let $answer = document.createElement('li');

      if(answerJSON.correct === true){

        $answer.className = 'correct';
        this.$meta.innerText = `Correct Answer = ${answerJSON.answer}`;
        $answer.addEventListener('click', () => this.correctAnswerHandler());

      }else{

        $answer.className = 'false';
        $answer.addEventListener('click', () => this.wrongAnswerHandler());

      }

      $answer.innerText = answerJSON.answer;
      this.$answerList.appendChild($answer);

    }

  }

  correctAnswerHandler(){

    this.$puzzle.className = 'puzzle hidden';
    this.$answerList.innerHTML = '';

    this.socket.emit('rightAnswer', this.curPuzzleId);

    this.curPuzzleId = 0;

  }

  wrongAnswerHandler(){

    this.socket.emit('wrongAnswer');

  }

  mapUpdateHandler(colorPos){

    let nX = -1770 + (colorPos.x * 2);
    let nY = -(colorPos.y * 2);

    let minX = 0 - window.innerWidth/2;
    let maxX = -1770 + window.innerWidth/2;
    let minY = 0 - window.innerHeight/2;
    let maxY = -1080 + window.innerHeight/2;

    if(nX <= minX && nX >= maxX){
      this.$map.style.marginLeft = `${nX}px`;
    }
    if(nY <= minY && nY >= maxY){
      this.$map.style.marginTop = `${nY}px`;
    }

    if(colorPos.distance < 1){

      //this.$meta.innerText = `Move Closer (${Math.round(colorPos.distance * 100)}%)`;
      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, ${(1 - colorPos.distance) * 1.6})`;

    }else if(colorPos.distance > 1){

      //this.$meta.innerText = `Mover Away (${Math.round((1 + (1 - colorPos.distance)) * 100) + 20}%)`;
      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, 0)`;

    }else{

      //this.$meta.innerText = `Good Position (100%)`;
      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, 0)`;

    }

  }

}
