'use strict';

let container;
let camera, scene, renderer, object3D;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

import SocketPage from './SocketPage';

//import {redirectToPage} from '../helpers/util';


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

  }
  init3D(){

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
      object3D = object;
      //add object to WebGL scene
      scene.add( object );
    }, onProgress, onError );
  }



    //render scene
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //add scene to DOM
    container.appendChild( renderer.domElement );

    //event listeners
    document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
    window.addEventListener( 'resize', this.onWindowResize, false );
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
  }
  onKeyDown(e){

    switch (e.keyCode) {
    case 37:
      e.preventDefault();
      console.log('left');
      break;
    case 38:
      e.preventDefault();
      console.log('up');
      this.rotateX(0.785398);
      break;
    case 39:
      e.preventDefault();
      console.log('right');
      break;
    case 40:
      e.preventDefault();
      console.log('down');
      this.rotateX(-0.785398);
      break;
    }
  }

  rotateX(rot){
    console.log('rotating');
    //gaat redelijk traag?
    object3D.rotation.x += rot;
    //animate();
  }

  onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

  }
  //
  animate() {
    requestAnimationFrame( this.animate.bind(this));
    this.render();
  }
  render() {

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( -mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
  }

}
