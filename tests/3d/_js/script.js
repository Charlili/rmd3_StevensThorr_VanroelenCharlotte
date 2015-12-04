'use strict';

var container;
var camera, scene, renderer, object3D;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

import {mobileCheck, removeByClassName} from './helpers/util';

//import Video from './modules/Video';
import Status from '../models/Status';
let helper;
let socket, qr, passcode;
let $meta, $vidElem;
let blnScanned = false;



const initSocket = () => {

  passcode = Math.floor((Math.random()*8999)+1000);
  console.log(passcode);
  //passcode = 1000;
  socket = io('http://172.30.17.143:3000');

  if(mobileCheck()){
    helper.innerHTML = 'initSocket mobile';
    socket.emit('setDeviceType', 'Mobile');
    socket.on('connect', setMobile);
  }else{
    helper.innerHTML = 'initSocket desktop';
    socket.emit('setDeviceType', 'Desktop');
    socket.emit('setCode', passcode);
    socket.on('connect', setComputer);
    socket.on('clickedUI', rotateX);
  }
  socket.on('pairedDesktop', pairedDesktopHandler);
  socket.on('pairedMobile', pairedMobileHandler);
  setStatus(Status.ready);

};

const setMobile = () => {
  setStatus('searching');

  let main = document.querySelector('.main');
  main.style.backgroundColor = 'lightblue';
  let input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter code here.';
  input.className = 'inputCode';
  main.appendChild(input);
  input.addEventListener( 'blur', enteredInput, false );

};

const setComputer = () => {
  console.log(socket);
  helper.innerHTML = `Please fill in this code: ${passcode}`;
  console.log(`Creating codehtml and code is ${passcode}`);
  setStatus('searching');

};

const enteredInput = (e) => {
  console.log(e.target.value);
  socket.emit('checkCode', parseInt(e.target.value));
};


const pairedDesktopHandler = () => {

  console.log('[Desktop] Paired with Phone');

  setStatus('paired');
  helper.innerHTML = `Paired together!`;
  setup3D();

};

const pairedMobileHandler = () => {
  //mobile stuff
  removeByClassName('.inputCode');
  helper.innerHTML = 'Paired together!!!!';

  let up = document.createElement('div');
  up.innerHTML = 'up';
  up.addEventListener( 'click', () => {
    socket.emit('clickedUI', -.5);
  }, false );
  let down = document.createElement('div');
  down.innerHTML = 'down';
  down.addEventListener( 'click', () => {
    socket.emit('clickedUI', -.5);
  }, false );
  document.querySelector('.main').appendChild(up);
  document.querySelector('.main').appendChild(down);




};

const initScanner = () => {

  console.log('[Mobile] Intialising Scanner');

  setStatus('searching');

  $meta.innerText = `Searching...`;

  qr.decodeFromVideo($vidElem, (err, result) => {

    if (err) throw err;

    // -!- TODO: Implement socketId validation
    //socket.emit('setPaired', result);

    blnScanned = true;

    $meta.innerText = `Scanned: ${result}`;

  }, true);

  if(blnScanned === false){
    setTimeout(initScanner, 200);
  }

};

const setStatus = status => {

  socket.emit('setStatus', status);

};

const init = () => {

  helper = document.querySelector('.main p');
  helper.innerHTML = 'initFunction';
  initSocket();

};



function setup3D(){
  init3D();
  animate();
}

function init3D() {

  container = document.body.querySelector('.main');
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 100;

  // scene
  scene = new THREE.Scene();
  var ambient = new THREE.AmbientLight( 0x101030 );
  scene.add( ambient );
  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 );
  scene.add( directionalLight );

  // texture
  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
  };
  var texture = new THREE.Texture();
  // texture loading %
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };
  var onError = function ( xhr ) {
    console.log('error: ' + xhr);
  };

  //loading the assets: texture
  var loader = new THREE.ImageLoader( manager );
  loader.load( 'assets/baby.jpg', ( image ) => {
    texture.image = image;
    texture.needsUpdate = true;
  } );
  //loading the assets: model
  var loader = new THREE.OBJLoader( manager );
  loader.load( 'assets/baby.obj', (object ) => {
    object.traverse( ( child ) => {
      if ( child instanceof THREE.Mesh ) {
        child.material.map = texture;
      }
    } );
    object.position.y = 0;
    object3D = object;
    //add object to WebGL scene
    scene.add( object );
  }, onProgress, onError );

  //render scene
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  //add scene to DOM
  container.appendChild( renderer.domElement );

  //event listeners
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener('keydown', onKeyDown, false);
}

function onKeyDown(e){

  switch (e.keyCode) {
  case 37:
    e.preventDefault();
    console.log('left');
    break;
  case 38:
    e.preventDefault();
    console.log('up');
    rotateX(.5);
    break;
  case 39:
    e.preventDefault();
    console.log('right');
    break;
  case 40:
    e.preventDefault();
    console.log('down');
    rotateX(-.5);
    break;
  }
}

function rotateX(rot){
  console.log('rotating');
  //gaat redelijk traag?
  object3D.rotation.x += rot;
  //animate();
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;

}
//
function animate() {
  requestAnimationFrame( animate );
  render();
}
function render() {

  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( -mouseY - camera.position.y ) * .05;
  camera.lookAt( scene.position );
  renderer.render( scene, camera );
}

init();
