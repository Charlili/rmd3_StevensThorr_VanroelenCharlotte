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

	eval("__webpack_require__(1);\nmodule.exports = __webpack_require__(4);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\n// some features need the be polyfilled..\n// https://babeljs.io/docs/usage/polyfill/\n\n// import 'babel-core/polyfill';\n// or import specific polyfills\n// import {$} from './helpers/util';\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _modulesVideo = __webpack_require__(2);\n\nvar _modulesVideo2 = _interopRequireDefault(_modulesVideo);\n\nvar _modelsStatus = __webpack_require__(3);\n\nvar _modelsStatus2 = _interopRequireDefault(_modelsStatus);\n\nvar socket = undefined,\n    peer = undefined;\nvar you = undefined /*, stranger*/;\n\nvar initSocket = function initSocket() {\n\n  socket = io('http://localhost:3000');\n\n  socket.on('connect', initPeer);\n  /*socket.on('found', found);*/\n  setStatus(_modelsStatus2['default'].ready);\n};\n\nvar initPeer = function initPeer() {\n\n  peer = new Peer({\n    'key': 'zor0hfk2x340a4i'\n  });\n\n  peer.on('open', function (peerId) {\n\n    console.log('peer connected: ' + peerId);\n\n    socket.emit('peerId', peerId);\n    you.setMeta('PeerID: ' + peerId + ' | Searching for QR Code');\n    setStatus(_modelsStatus2['default'].searching);\n  });\n\n  /*peer.on('call', call => {\n     call.answer(you.stream);\n    call.on('stream', strangerStream);\n    call.on('close', closedStream);\n   });*/\n};\n\n/*const closedStream = () => {\n\n  stranger.removeStream();\n  setStatus(Status.searching);\n\n};*/\n\n/*const strangerStream = stream => {\n\n  stranger.showStream(stream);\n  setStatus(Status.streaming);\n\n};*/\n\n/*const found = peerId => {\n\n  //console.log('found partner: ', peerId);\n\n  let call = peer.call(peerId, you.stream);\n  call.on('stream', strangerStream);\n\n};*/\n\nvar setStatus = function setStatus(status) {\n\n  socket.emit('status', status);\n};\n\nvar userStream = function userStream(stream) {\n\n  //console.log(stream);\n\n  you = new _modulesVideo2['default'](document.querySelector('.you'));\n  //stranger = new Video(document.querySelector('.stranger'));\n\n  you.showStream(stream);\n\n  initSocket();\n};\n\nvar initBackCamera = function initBackCamera(sourceInfos) {\n\n  var videoSourceID = undefined;\n\n  for (var i = 0; i !== sourceInfos.length; ++i) {\n    var sourceInfo = sourceInfos[i];\n    if (sourceInfo.kind === 'video') {\n      videoSourceID = sourceInfo.id;\n    }\n  }\n\n  console.log(videoSourceID);\n\n  navigator.getUserMedia({ video: { optional: [{ sourceId: videoSourceID }] } }, userStream, console.error);\n};\n\nvar init = function init() {\n\n  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;\n\n  MediaStreamTrack.getSources(initBackCamera);\n\n  /*navigator.getUserMedia(\n    {video: true},\n    userStream,\n    console.error\n  );*/\n};\n\ninit();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/script.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/script.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }\n\nvar Video = (function () {\n  function Video($el) {\n    _classCallCheck(this, Video);\n\n    this.$el = $el;\n\n    this.$video = this.$el.querySelector('video');\n    this.$meta = this.$el.querySelector('.meta');\n  }\n\n  _createClass(Video, [{\n    key: 'showStream',\n    value: function showStream(stream) {\n      this.stream = stream;\n      this.$video.src = window.URL.createObjectURL(stream);\n    }\n  }, {\n    key: 'removeStream',\n    value: function removeStream() {\n      this.stream = '';\n      this.$video.src = '';\n    }\n  }, {\n    key: 'setMeta',\n    value: function setMeta(text) {\n      this.$meta.innerText = text;\n    }\n  }]);\n\n  return Video;\n})();\n\nexports['default'] = Video;\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/modules/Video.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/modules/Video.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\nmodule.exports = {\n  'not ready': 0,\n  'ready': 1,\n  'searching': 2,\n  'paired': 3,\n  'streaming': 4\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./models/Status.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./models/Status.js?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_scss/style.scss\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_scss/style.scss?");

/***/ }
/******/ ]);