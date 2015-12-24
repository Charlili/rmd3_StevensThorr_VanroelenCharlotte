'use strict';

import SocketPage from './SocketPage';

import {redirectToPage, rgbToHex, httpGetAsync} from '../helpers/util';

let MIN_AXIS = 40;
let MAX_AXIS = 140;

let PREF_MIN = 70;
let PREF_MAX = 100;

let mouseX = 0;
let mouseY = 0;

export default class DesktopMapSyncPage extends SocketPage{

  constructor(socket, clientDetails){

    super(socket);

    // -- Class Variables -------------
    this.clientDetails = clientDetails;
    this.socket = socket;
    this.trackColor = {};
    this.trackColor.hex = 'magenta';
    this.foundCodexes = 0;
    this.recalibrating = false;
    this.curPuzzleId = 0;

    // -- Element Variables ----------
    this.$meta = document.querySelector('.meta');
    this.$video = document.getElementById('video');
    this.$canvas = document.getElementById('canvas');
    this.$codexList = document.querySelector('.codexList');
    this.$mapOverlay = document.querySelector('.mapOverlay');
    this.$puzzleInfo = document.querySelector('.puzzleInfo');
    this.$puzzleImage = document.querySelector('.puzzleImg');
    this.$puzzleTitle = document.querySelector('.puzzleTitle');
    this.$question = document.querySelector('.question');
    this.$recalibrate = document.querySelector('.recalibrate');
    this.$colorIndicator = document.querySelector('.colorIndicator');

    // -- Event Handlers -------------
    this.socket.on('fillInventory', (clientInfo) => this.fillInventory(clientInfo));
    this.socket.on('showPuzzle', (puzzleJSON) => this.showPuzzle(puzzleJSON));
    this.socket.on('closePuzzle', () => this.closePuzzle());
    this.socket.on('rightAnswer', (puzzleId) => this.rightAnswerHandler(puzzleId));
    this.socket.on('wrongAnswer', () => this.wrongAnswerHandler());
    this.$recalibrate.addEventListener('click', () => this.toggleRecalibration());
    this.$colorIndicator.addEventListener('click', () => this.changeTrackingColor());

  }

  init(){

    console.log('[DesktopMapSync] Colortracking Smartphone');

    this.socket.emit('getInventory');

    this.context = this.$canvas.getContext('2d');
    this.$canvas.width = this.$video.width;
    this.$canvas.height = this.$video.height;

    this.tracker = new tracking.ColorTracker();
    this.trackingTask = this.tracker.on('track', (event) => {

      this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

      event.data.forEach( (rect) => {

        this.trackResult(rect);

      });

    });
    tracking.track(this.$video, this.tracker, { camera: true });

  }

  fillInventory(clientInfo){

    for(let i = 0; i < clientInfo.foundCodexes.length; i++){

      let $codexLi = document.createElement('li');
      $codexLi.setAttribute('puzzleId', i+1);

      if(clientInfo.solvedCodexes[i] === true){
        $codexLi.className = `codex${i+1} solved`;
      }else if(clientInfo.foundCodexes[i] === true){
        $codexLi.className = `codex${i+1} found`;
        $codexLi.addEventListener('click', (e) => this.clickedCodexHandler(e));
      }else{
        $codexLi.className = `codex${i+1}`;
      }

      this.$codexList.appendChild($codexLi);

    }

  }

  clickedCodexHandler(e){

    let puzzleId = e.currentTarget.getAttribute('puzzleId');
    httpGetAsync(`${window.location.href.substr(0, window.location.href.indexOf('/d'))}/api/puzzles/${puzzleId}`, (puzzleJSON) => {
      this.socket.emit('showPuzzle', puzzleJSON);
      puzzleJSON = JSON.parse(puzzleJSON);
      this.showPuzzle(puzzleJSON);
    });

  }

  trackResult(rect){

    rect.color = this.trackColor.hex;
    this.context.strokeStyle = rect.color;
    this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);

    let checkAxis = rect.height;
    if(rect.width > rect.height){
      checkAxis = rect.width;
    }

    if(
      checkAxis >= MIN_AXIS && checkAxis <= MAX_AXIS &&
      rect.x > 0 && rect.x <= (this.$canvas.width - rect.width) &&
      rect.y > 0 && rect.y <= (this.$canvas.height - rect.height)
    ){

      let colorPos = {};

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

  }

  changeColorIndicator(e){

    if(this.recalibrating === true){

      mouseX = e.pageX;
      mouseY = e.pageY;

      this.$colorIndicator.style.left = `${mouseX -15}px`;
      this.$colorIndicator.style.top = `${mouseY -15}px`;

      this.$colorIndicator.style.backgroundColor = `${this.extractColor().hex}`;

    }

  }

  extractColor(){

    let context = this.$canvas.getContext('2d');
    context.drawImage(this.$video, 0, 0, this.$canvas.width, this.$canvas.height);

    let canvasX = mouseX - (window.innerWidth - this.$canvas.width)/2;
    let canvasY = mouseY + (window.innerHeight - this.$canvas.height) + 22;

    let colorInfo = {};

    let p = context.getImageData(canvasX, canvasY, 1, 1).data;

    colorInfo.hex = `#${('000000' + rgbToHex(p[0], p[1], p[2])).slice(-6)}`;
    colorInfo.r = p[0];
    colorInfo.g = p[1];
    colorInfo.b = p[2];

    return colorInfo;

  }

  toggleRecalibration(){

    if(this.recalibrating === false){
      this.recalibrating = true;
      document.onmousemove = (e) => this.changeColorIndicator(e);
      this.$recalibrate.innerText = 'Click here to stop recalibrating.';
      this.$mapOverlay.className = 'mapOverlay showVideo';
    }else{
      this.recalibrating = false;
      this.$recalibrate.innerText = 'Having problems with your phone? Click here to recalibrate your tracking sticker.';
      this.$mapOverlay.className = 'mapOverlay';
    }

  }

  changeTrackingColor(){

    this.$meta.innerText = `New trackingColor: ${this.trackColor}`;

    this.trackColor = this.extractColor();
    this.tracker.customColor = this.trackColor.hex;

    tracking.ColorTracker.registerColor(this.trackColor.r, this.trackColor.g, this.trackColor.b);

    this.$meta.innerText = `New trackingColor: ${this.trackColor}`;

    tracking.ColorTracker.registerColor('custom', (r, g, b) => {

      if(
        r < (this.trackColor.r + 26) && r > (this.trackColor.r - 26) &&
        g < (this.trackColor.g + 26) && g > (this.trackColor.g - 26) &&
        b < (this.trackColor.b + 26) && b > (this.trackColor.b - 26)
      ){
        return true;
      }

      return false;

    });

    this.tracker = new tracking.ColorTracker('custom');
    this.tracker.on('track', (event) => {

      this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

      event.data.forEach( (rect) => {

        this.trackResult(rect);

      });

    });
    this.trackingTask = tracking.track(this.$video, this.tracker, { camera: true });

  }

  showPuzzle(puzzleJSON){

    this.$puzzleInfo.className = 'puzzleInfo';
    this.$puzzleImage.setAttribute('src', `../../img/puzzles/${puzzleJSON.image}`);
    this.$puzzleTitle.innerText = puzzleJSON.title;
    this.$question.innerText = puzzleJSON.question;

    let $inventoryCodex = document.querySelector(`.codex${puzzleJSON.puzzle_id}`);
    $inventoryCodex.className = `codex${puzzleJSON.puzzle_id} found`;
    $inventoryCodex.addEventListener('click', (e) => this.clickedCodexHandler(e));

  }

  closePuzzle(){

    this.$puzzleInfo.className = 'puzzleInfo hidden';

  }

  wrongAnswerHandler(){

    this.$puzzleInfo.className = 'puzzleInfo wrongAnswer';

    let lives = document.body.querySelectorAll('.score .life');
    let heartIcons = document.body.querySelectorAll('.score .life i');
    if(lives.length === 0){
      document.body.querySelector('.fail').classList.remove('hidden');
      let bg = document.createElement('div');
      bg.classList.add('failed_bg');
      document.body.querySelector('.desktopView').appendChild(bg);
    }else{
      lives[lives.length - 1].classList.remove('life');
      heartIcons[lives.length - 1].className = 'fa fa-heart-o';
    }

    setTimeout(() => {
      this.$puzzleInfo.className = 'puzzleInfo';
    }, 350);

  }

  rightAnswerHandler(puzzleId){

    let $inventoryCodex = document.querySelector(`.codex${puzzleId}`);
    $inventoryCodex.className = `codex${puzzleId} solved`;

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

  }

}
