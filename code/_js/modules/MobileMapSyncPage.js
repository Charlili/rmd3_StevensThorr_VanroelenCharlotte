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
    this.tries = 0;

    // -- Element Variables ----------
    this.$map = document.querySelector('.map');
    this.$lightOverlay = document.querySelector('.lightOverlay');
    this.$codexList = document.querySelector('.codexList');
    this.$puzzle = document.querySelector('.puzzle');
    this.$puzzleTitle = document.querySelector('.puzzleTitle');
    this.$answerList = document.querySelector('.puzzle ul');

    // -- Event Handlers -------------
    this.socket.on('showCodexes', (clientInfo) => this.showCodexes(clientInfo));
    this.socket.on('updateMapPos', (colorPos) => this.mapUpdateHandler(colorPos));
    this.socket.on('showPuzzle', (puzzleJSON) => this.showAnswers(puzzleJSON));
    this.socket.on('foundAllCodexes', () => redirectToPage(`m/${this.clientDetails.refcode}/3d`));

  }

  init(){

    this.socket.emit('getCodexes');

  }

  showCodexes(clientInfo){

    for(let i = 0; i < clientInfo.foundCodexes.length; i++){

      let $codexLi = document.createElement('li');
      $codexLi.setAttribute('puzzleId', i+1);

      if(clientInfo.foundCodexes[i] === false){
        $codexLi.className = `codex${i+1} found`;
        $codexLi.addEventListener('click', (e) => this.clickedCodexHandler(e));
      }else{
        $codexLi.className = `codex${i+1}`;
        $codexLi.style.display = 'none';
      }

      this.$codexList.appendChild($codexLi);

    }

  }

  clickedCodexHandler(e){

    e.currentTarget.style.display = 'none';

    this.showPuzzle(e.currentTarget.getAttribute('puzzleId'));

  }

  showPuzzle(puzzleId){

    httpGetAsync(`${window.location.href.substr(0, window.location.href.indexOf('/m'))}/api/puzzles/${puzzleId}`, (puzzleJSON) => this.showAnswers(puzzleJSON));

  }

  showAnswers(puzzleJSON){

    this.$puzzle.className = 'puzzle';

    let logicPuzzle = JSON.parse(puzzleJSON);
    this.curPuzzleId = logicPuzzle.puzzle_id;

    this.socket.emit('showPuzzle', logicPuzzle);

    this.$puzzleTitle.innerText = `${logicPuzzle.title}`;

    this.$answerList.innerHTML = '';
    for(let i = 0; i < logicPuzzle.answers.length; i++){

      let answerJSON = logicPuzzle.answers[i];
      let $answer = document.createElement('li');

      if(answerJSON.correct === true){

        $answer.className = 'correct';
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

    let minX = -window.innerWidth/2;
    let maxX = -1770 + window.innerWidth/2;
    let minY = -window.innerHeight/2;
    let maxY = -1080 + window.innerHeight/2;

    if(nX <= minX && nX >= maxX){
      this.$map.style.marginLeft = `${nX}px`;
    }
    if(nY <= minY && nY >= maxY){
      this.$map.style.marginTop = `${nY}px`;
    }

    if(colorPos.distance < 1){

      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, ${(1 - colorPos.distance) * 1.6})`;

    }else if(colorPos.distance > 1){

      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, 0)`;

    }else{

      this.$lightOverlay.style.backgroundColor = `rgba(0, 0, 0, 0)`;

    }

  }

}
