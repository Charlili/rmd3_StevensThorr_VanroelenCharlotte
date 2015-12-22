'use strict';

let container;
let camera, scene, renderer, object3D;
let codexArray, selectedCodex, faceArray;
let count = -1, dir = 0.01;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

import SocketPage from './SocketPage';

import {redirectToPage} from '../helpers/util';


export default class DesktopMapSyncPage extends SocketPage{

  constructor(socket, clientDetails){

    super(socket);

    // -- Class Variables -------------
    this.clientDetails = clientDetails;
    this.socket = socket;

    // -- Element Variables ----------
    this.$meta = document.querySelector('.meta');

    // -- Element Manipulation -------


    // -- Event Handlers -------------


  }

  init(){

    console.log('[Desktop3d]');
    this.init3D();
    this.animate();

    document.body.querySelector('.overlay-ok').addEventListener('click', this.clickHandler);

  }
  clickHandler(e){
    e.preventDefault();
    e.currentTarget.parentNode.classList.add('hidden');
    console.log('Hello');
  }
  init3D(){

    container = document.body.querySelector('.main');
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 100;

    // scene
    scene = new THREE.Scene();
    codexArray = [0,1,2,3,4,5];
    faceArray = [0,0,0,0,0,0];

    var ambient = new THREE.AmbientLight( 0x444444 );
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
  loader.load( '../../3d/codex_1.png', ( image ) => {
    texture.image = image;
    texture.needsUpdate = true;
  } );

  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

  for(let i = 1; i <= 6; i++){
    var loader = new THREE.OBJMTLLoader(manager);
    loader.load( `../../3d/codex_${i}.obj`, `../../3d/codex_${i}.mtl`, (object ) => {
      object.traverse( ( child ) => {
        if ( child instanceof THREE.Mesh ) {
          child.material.map = texture;
        }
      } );
      object.position.y = 0;
      object.scale.set( .5, .5, .5 );

      let rand = Math.floor((Math.random() * 8));
      console.log(`rotating ${rand} times`);
      faceArray[i-1] = rand;
      object.rotation.x = rand * 0.785398;
      object3D = object;
      //not using push so that slow-loading objects don't mess up the goddamn volgorde
      codexArray[i-1] = object;

      //add object to WebGL scene
      scene.add( object );
    }, onProgress, onError );
  }

    selectedCodex = 0;

    //render scene
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //add scene to DOM
    container.appendChild( renderer.domElement );

    //event listeners
    window.addEventListener( 'resize', this.onWindowResize, false );
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
  }
  onKeyDown(e){

    switch (e.keyCode) {
    case 37:
      e.preventDefault();
      //console.log('left');
      --selectedCodex;
      if(selectedCodex == -1)selectedCodex = 5;
      break;
    case 38:
      e.preventDefault();
      //console.log('up');
      this.rotateX(0.785398);
      break;
    case 39:
      e.preventDefault();
      //console.log('right');
      ++selectedCodex;
      if(selectedCodex == 6)selectedCodex = 0;
      break;
    case 40:
      e.preventDefault();
      //console.log('down');
      this.rotateX(-0.785398);
      break;
    }

    //6.28319rad == 360degrees
    let solved = false;
    let rad = 6.28319;

  }

  rotateX(rot){
    console.log('rotating');
    //gaat redelijk traag?
    codexArray[selectedCodex].rotation.x += rot;
    if(rot > 0)faceArray[selectedCodex] += 1;
    else faceArray[selectedCodex] -= 1;

    if(faceArray[selectedCodex] === -1)faceArray[selectedCodex] = 7;
    else if(faceArray[selectedCodex] === 8)faceArray[selectedCodex] = 0;

    console.log(`Codex number ${selectedCodex} now has face value ${faceArray[selectedCodex]}`);

    let succes = faceArray.every(function(n){ return n === faceArray[0] })
    //.log(succes);

    if(succes){
      document.body.querySelector('.win').classList.remove('hidden');
    }

    //animate();
  }

  onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  //
  animate() {
    requestAnimationFrame( this.animate.bind(this));
    this.render();
  }
  render() {


    count += dir;
    if(count > 1 || count < -1)dir * -1;


    camera.position.x = 50*Math.sin(count);
    camera.position.y = 50*Math.cos(count) ;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
  }

}
