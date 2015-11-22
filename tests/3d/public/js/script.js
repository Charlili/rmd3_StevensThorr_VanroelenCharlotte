/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("__webpack_require__(1);\nmodule.exports = __webpack_require__(2);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("'use strict';\n\nvar container;\nvar camera, scene, axis, renderer, object3D;\nvar mouseX = 0,\n    mouseY = 0;\nvar windowHalfX = window.innerWidth / 2;\nvar windowHalfY = window.innerHeight / 2;\nvar rad = 0;\ninit();\nanimate();\n\nfunction init() {\n\n  container = document.body.querySelector('.main');\n  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);\n  camera.position.z = 100;\n  var axis = new THREE.Vector3(0.5, 0.5, 0);\n\n  // scene\n  scene = new THREE.Scene();\n  var ambient = new THREE.AmbientLight(0x101030);\n  scene.add(ambient);\n  var directionalLight = new THREE.DirectionalLight(0xffeedd);\n  directionalLight.position.set(0, 0, 1);\n  scene.add(directionalLight);\n\n  // texture\n  var manager = new THREE.LoadingManager();\n  manager.onProgress = function (item, loaded, total) {\n    console.log(item, loaded, total);\n  };\n  var texture = new THREE.Texture();\n  // texture loading %\n  var onProgress = function onProgress(xhr) {\n    if (xhr.lengthComputable) {\n      var percentComplete = xhr.loaded / xhr.total * 100;\n      console.log(Math.round(percentComplete, 2) + '% downloaded');\n    }\n  };\n  var onError = function onError(xhr) {};\n\n  //loading the assets: texture\n  var loader = new THREE.ImageLoader(manager);\n  loader.load('assets/baby.jpg', function (image) {\n    texture.image = image;\n    texture.needsUpdate = true;\n  });\n  //loading the assets: model\n  var loader = new THREE.OBJLoader(manager);\n  loader.load('assets/baby.obj', function (object) {\n    object.traverse(function (child) {\n      if (child instanceof THREE.Mesh) {\n        child.material.map = texture;\n      }\n    });\n    object.position.y = 0;\n    object3D = object;\n    //add object to WebGL scene\n    scene.add(object);\n  }, onProgress, onError);\n\n  //render scene\n  renderer = new THREE.WebGLRenderer();\n  renderer.setPixelRatio(window.devicePixelRatio);\n  renderer.setSize(window.innerWidth, window.innerHeight);\n\n  //add scene to DOM\n  container.appendChild(renderer.domElement);\n\n  //event listeners\n  document.addEventListener('mousemove', onDocumentMouseMove, false);\n  window.addEventListener('resize', onWindowResize, false);\n  document.addEventListener('keydown', onKeyDown, false);\n}\n\nfunction onKeyDown(e) {\n\n  switch (e.keyCode) {\n    case 37:\n      e.preventDefault();\n      console.log('left');\n      break;\n    case 38:\n      e.preventDefault();\n      console.log('up');\n      rotate(.5);\n      break;\n    case 39:\n      e.preventDefault();\n      console.log('right');\n      break;\n    case 40:\n      e.preventDefault();\n      console.log('down');\n      rotate(-.5);\n      break;\n  }\n}\n\nfunction rotate(rot) {\n  console.log('rotating');\n  //object3D.rotateOnAxis(axis,rad);\n  object3D.rotation.x += rot;\n}\n\nfunction onWindowResize() {\n\n  windowHalfX = window.innerWidth / 2;\n  windowHalfY = window.innerHeight / 2;\n  camera.aspect = window.innerWidth / window.innerHeight;\n  camera.updateProjectionMatrix();\n  renderer.setSize(window.innerWidth, window.innerHeight);\n}\n\nfunction onDocumentMouseMove(event) {\n\n  mouseX = (event.clientX - windowHalfX) / 2;\n  mouseY = (event.clientY - windowHalfY) / 2;\n}\n//\nfunction animate() {\n  requestAnimationFrame(animate);\n  render();\n}\nfunction render() {\n\n  camera.position.x += (mouseX - camera.position.x) * .05;\n  camera.position.y += (-mouseY - camera.position.y) * .05;\n  camera.lookAt(scene.position);\n  renderer.render(scene, camera);\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/script.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/script.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_scss/style.scss\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_scss/style.scss?");

/***/ }
/******/ ]);