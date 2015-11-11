'use strict';

const init = () => {

	let scene, camera, renderer;
	let OrbitControls = require('three-orbit-controls')(THREE);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight,
    1, 1000
  );

  var loader = new THREE.OBJLoader();

  // load a resource
  loader.load(
    // resource URL
    'assets/baby.json',
    // Function when resource is loaded
    function ( object ) {
      scene.add( object );
    }
  );

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  new OrbitControls(camera);

  document.querySelector('main').appendChild(renderer.domElement);

  //box();
  spheres = createSpheres(50);
  render();

};

init();
