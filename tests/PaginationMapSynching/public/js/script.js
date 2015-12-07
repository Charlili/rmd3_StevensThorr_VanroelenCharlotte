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

	eval("__webpack_require__(1);\nmodule.exports = __webpack_require__(7);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _helpersUtil = __webpack_require__(2);\n\nvar _modulesVideo = __webpack_require__(4);\n\nvar _modulesVideo2 = _interopRequireDefault(_modulesVideo);\n\nvar _modelsStatus = __webpack_require__(5);\n\nvar _modelsStatus2 = _interopRequireDefault(_modelsStatus);\n\nvar _modelsDeviceTypes = __webpack_require__(6);\n\nvar _modelsDeviceTypes2 = _interopRequireDefault(_modelsDeviceTypes);\n\nvar socket = undefined,\n    qr = undefined,\n    passcode = undefined,\n    refcode = undefined,\n    codexpass = undefined;\nvar $video = undefined,\n    $meta = undefined,\n    $vidElem = undefined;\nvar blnScanned = false;\nvar blnRedirect = false;\nvar clientDetails = undefined;\n\nvar initSocket = function initSocket() {\n\n  //socket = io('192.168.43.35.:3000');\n  socket = io('192.168.0.178.:3000');\n\n  if ((0, _helpersUtil.mobileCheck)()) {\n    clientDetails = { deviceType: _modelsDeviceTypes2['default'].mobile };\n    socket.on('clientConnect', initMobile);\n    socket.on('paired', desktopPairedHandler);\n  } else {\n    clientDetails = { deviceType: _modelsDeviceTypes2['default'].desktop };\n    socket.on('clientConnect', initDesktop);\n    socket.on('paired', phonePairedHandler);\n  }\n\n  if ((0, _helpersUtil.getUrlPaths)().length >= 5 && (0, _helpersUtil.checkUrlPath)('pair') === false) {\n    refcode = (0, _helpersUtil.getUrlPaths)()[4];\n    passcode = (0, _helpersUtil.numbersFromString)(refcode);\n    clientDetails.refcode = refcode;\n    socket.on('createNewClient', createNewClient);\n    socket.emit('setClient', clientDetails);\n  } else {\n    createNewClient();\n  }\n\n  socket.on('PaginationRePair', paginationRePairHandler);\n};\n\nvar createNewClient = function createNewClient() {\n  var redirect = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];\n\n  console.log('[Script] Creating new client');\n\n  passcode = Math.floor(Math.random() * 8999 + 1000);\n  refcode = '' + (0, _helpersUtil.createId)(1) + passcode + (0, _helpersUtil.createId)(1);\n  clientDetails.passcode = passcode;\n  clientDetails.refcode = refcode;\n\n  blnRedirect = redirect;\n\n  socket.emit('createClient', clientDetails);\n};\n\nvar paginationRePairHandler = function paginationRePairHandler(pairedRef) {\n\n  console.log('[Script] Re Pairing Clients');\n\n  socket.emit('rePair', pairedRef);\n};\n\nvar setStatus = function setStatus(status) {\n\n  socket.emit('setStatus', status);\n};\n\n/* --- Desktop ------------------------------------------------------ */\n\nvar initDesktop = function initDesktop() {\n\n  console.log('[Desktop] Intialising for Desktop');\n\n  $meta = document.querySelector('.meta');\n\n  if ((0, _helpersUtil.checkUrlPath)('d') && blnRedirect === false) {\n\n    switch ((0, _helpersUtil.getUrlPaths)()[5]) {\n\n      case 'home':\n\n        //stuff\n\n        break;\n\n      case 'connect':\n      case '':\n      default:\n\n        document.querySelector('.passcode').innerText = passcode;\n\n        createQR();\n        setStatus(_modelsStatus2['default'].ready);\n\n        break;\n\n    }\n  } else {\n\n    (0, _helpersUtil.redirectToPage)('d/' + refcode);\n  }\n};\n\nvar createQR = function createQR() {\n\n  console.log('[Desktop] Creating QR Code');\n\n  var $qrcode = document.querySelector('.QRCode');\n  $qrcode.setAttribute('src', 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + socket.id);\n\n  $meta.innerText = 'SocketID: ' + socket.id + ' // Open with phone and scan to pair';\n\n  setStatus('searching');\n};\n\nvar phonePairedHandler = function phonePairedHandler(pairedId) {\n\n  console.log('[Desktop] Paired with Phone');\n\n  socket.emit('setPaired', pairedId);\n\n  setStatus('paired');\n\n  $meta.innerText = 'Socket_ID: ' + socket.id + ' // Paired with: ' + pairedId;\n};\n\n/* --- Mobile ------------------------------------------------------ */\n\nvar initMobile = function initMobile() {\n\n  //console.log('[Mobile] Intialising for Mobile');\n\n  $meta = document.querySelector('.meta');\n\n  if ((0, _helpersUtil.checkUrlPath)('m') && blnRedirect === false) {\n\n    switch ((0, _helpersUtil.getUrlPaths)()[5]) {\n\n      case 'home':\n\n        //stuff\n\n        break;\n\n      case 'pair':\n\n        (0, _helpersUtil.redirectToPage)('m/' + refcode);\n\n        break;\n\n      case 'connect':\n      case '':\n      default:\n\n        codexpass = 'XXXX';\n\n        for (var i = 0; i < 4; i++) {\n          document.getElementsByClassName('upButton')[i].addEventListener('click', function (evt) {\n            changePassValue(evt, 1);\n          });\n          document.getElementsByClassName('downButton')[i].addEventListener('click', function (evt) {\n            changePassValue(evt, -1);\n          });\n        }\n\n        MediaStreamTrack.getSources(initBackCamera);\n\n        break;\n\n    }\n  } else {\n\n    (0, _helpersUtil.redirectToPage)('m/' + refcode);\n  }\n};\n\nvar changePassValue = function changePassValue(evt, direction) {\n\n  //console.log('[Script] Changing Codex Pair/Passcode Value');\n\n  var $codexTicker = evt.target.parentNode;\n  var index = Number((0, _helpersUtil.numbersFromString)($codexTicker.getAttribute('id'))) - 1;\n\n  var $rowValue = document.getElementsByClassName('rowValue')[index];\n  var value = $rowValue.innerHTML;\n\n  if (value === 'X') {\n    value = 0;\n  } else {\n    value = Number(value);\n  }\n\n  var newValue = undefined;\n  if (direction < 0 && value <= 0) {\n    newValue = 9;\n  } else if (direction > 0 && value >= 9) {\n    newValue = 0;\n  } else {\n    newValue = value + direction;\n  }\n\n  $rowValue.innerText = newValue;\n\n  codexpass = (0, _helpersUtil.replaceCharAt)(String(codexpass), index, String(newValue));\n\n  //$meta.innerText = `Incomplete code: ${numbersFromString(codexpass)}`;\n\n  if ((0, _helpersUtil.numbersFromString)(codexpass).length === 4) {\n    $meta.innerText = 'Complete code: ' + (0, _helpersUtil.numbersFromString)(codexpass).length;\n    socket.emit('checkCode', Number(codexpass));\n  } else {\n    $meta.innerText = 'Incomplete code: ' + (0, _helpersUtil.numbersFromString)(codexpass).length;\n  }\n};\n\nvar initBackCamera = function initBackCamera(sourceInfos) {\n\n  //console.log('[Mobile] Intialising Back Camera');\n\n  $meta.innerText = 'Initialising Back Camera';\n\n  var videoSourceID = undefined;\n\n  // Loop over videosources to always get the back-camera of the phone\n  for (var i = 0; i !== sourceInfos.length; ++i) {\n    var sourceInfo = sourceInfos[i];\n    if (sourceInfo.kind === 'video') {\n      videoSourceID = sourceInfo.id;\n    }\n  }\n\n  navigator.getUserMedia({ video: { optional: [{ sourceId: videoSourceID }] } }, backcamStream, console.error);\n\n  setStatus(_modelsStatus2['default'].ready);\n};\n\nvar backcamStream = function backcamStream(stream) {\n\n  //console.log('[Mobile] Intialising Userstreaam');\n\n  qr = new QCodeDecoder();\n\n  //$meta = document.querySelector('.meta');\n  $video = new _modulesVideo2['default'](document.querySelector('.you'));\n  $video.showStream(stream);\n  $vidElem = $video.getVideoElem();\n\n  initQCodeScan();\n};\n\nvar initQCodeScan = function initQCodeScan() {\n\n  //console.log('[Mobile] Intialising Scanner');\n\n  setStatus('searching');\n\n  $meta.innerText = 'Searching...';\n\n  qr.decodeFromVideo($vidElem, function (err, result) {\n\n    if (err) throw err;\n\n    // -!- TODO: Implement socketId validation\n    socket.emit('setPaired', result);\n\n    blnScanned = true;\n\n    $meta.innerText = 'Scanned: ' + result;\n  }, true);\n\n  if (blnScanned === false) {\n    setTimeout(initQCodeScan, 500);\n  }\n};\n\nvar desktopPairedHandler = function desktopPairedHandler(pairedId) {\n\n  //console.log('[Server] Paired 3 ---------');\n\n  $meta.innerText = 'Paired with: ' + pairedId;\n};\n\n/* --- Map Synching ----------------------------------------------- */\n\n/* --- Other ------------------------------------------------------ */\n\nvar init = function init() {\n\n  console.log('[Init] Initialising...');\n\n  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;\n\n  initSocket();\n};\n\ninit();\n//initSocket();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/script.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/script.js?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }\n\n__webpack_require__(3);\n\nvar html = function html(strings) {\n\n  var str = '';\n\n  if (Array.isArray(strings)) {\n    for (var i = 0; i < strings.length; i++) {\n      if (strings[i]) str += strings[i];\n      if (arguments[i + 1]) str += arguments[i + 1];\n    }\n  } else {\n    str = strings;\n  }\n\n  var doc = new DOMParser().parseFromString(str.trim(), 'text/html');\n\n  return doc.body.firstChild;\n};\n\nexports.html = html;\nvar prepend = function prepend($parent, $element) {\n\n  var $first = $parent.children[0];\n  $parent.insertBefore($element, $first);\n};\n\nexports.prepend = prepend;\nvar removeByClassName = function removeByClassName(selector) {\n\n  var $element = document.querySelector(selector);\n  $element.parentNode.removeChild($element);\n};\n\nexports.removeByClassName = removeByClassName;\nvar mobileCheck = function mobileCheck() {\n\n  var check = false;\n\n  (function (a) {\n    if (/(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i.test(a.substr(0, 4))) check = true;\n  })(navigator.userAgent || navigator.vendor || window.opera);\n\n  //console.log(check);\n\n  //return true;\n  return check;\n};\n\nexports.mobileCheck = mobileCheck;\nvar mobileAndTabletCheck = function mobileAndTabletCheck() {\n\n  var check = false;\n\n  (function (a) {\n    if (/(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i.test(a.substr(0, 4))) check = true;\n  })(navigator.userAgent || navigator.vendor || window.opera);\n\n  return check;\n};\n\nexports.mobileAndTabletCheck = mobileAndTabletCheck;\nvar checkUrlPath = function checkUrlPath(keyword) {\n\n  var hashes = [];\n  var check = false;\n\n  hashes = window.location.pathname.split('/');\n  if (hashes.indexOf(keyword) > -1) {\n    check = true;\n  }\n\n  return check;\n};\n\nexports.checkUrlPath = checkUrlPath;\nvar getUrlPaths = function getUrlPaths() {\n  var customUrl = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];\n\n  var checkurl = undefined;\n  if (customUrl === '') {\n    checkurl = window.location.href;\n  } else {\n    checkurl = customUrl;\n  }\n\n  return checkurl.split('/');\n};\n\nexports.getUrlPaths = getUrlPaths;\nvar getUrlVars = function getUrlVars() {\n  var customUrl = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];\n\n  var checkurl = undefined;\n  if (customUrl === '') {\n    checkurl = window.location.href;\n  } else {\n    checkurl = customUrl;\n  }\n\n  var vars = [],\n      hash = undefined;\n  var hashes = checkurl.slice(checkurl.indexOf('?') + 1).split('&');\n  for (var i = 0; i < hashes.length; i++) {\n    hash = hashes[i].split('=');\n    vars.push(hash[0]);\n    vars[hash[0]] = hash[1];\n  }\n  return vars;\n};\n\nexports.getUrlVars = getUrlVars;\nvar redirectToPage = function redirectToPage(path) {\n\n  var index = undefined,\n      baseUrl = undefined,\n      redirectUrl = undefined;\n\n  if (checkUrlPath('connect')) {\n    index = window.location.href.indexOf('/connect');\n  } else if (checkUrlPath('m')) {\n    index = window.location.href.indexOf('/m');\n  } else if (checkUrlPath('d')) {\n    index = window.location.href.indexOf('/d');\n  } else {\n    index = window.location.href.length;\n  }\n\n  baseUrl = window.location.href.substr(0, index);\n  redirectUrl = baseUrl + '/' + path;\n\n  //console.log('BaseUrl', baseUrl);\n  //console.log('RedirectUrl', redirectUrl);\n\n  window.location = redirectUrl;\n  //window.location.href = redirectUrl;\n  //window.location.href = `${path}`;\n};\n\nexports.redirectToPage = redirectToPage;\nvar numbersFromString = function numbersFromString(checkString) {\n\n  var nums = checkString.match(/\\d/g);\n  return nums.join('');\n};\n\nexports.numbersFromString = numbersFromString;\nvar replaceCharAt = function replaceCharAt(str, index, character) {\n\n  //console.log('[Util]', str, index, character);\n\n  return str.substr(0, index) + character + str.substr(index + character.length);\n};\n\nexports.replaceCharAt = replaceCharAt;\nvar createId = function createId(idLength) {\n\n  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';\n  var uniqid = '';\n\n  for (var i = 0; i < idLength; i++) {\n    uniqid += possible.charAt(Math.floor(Math.random() * possible.length));\n  }\n\n  return uniqid;\n};\n\nexports.createId = createId;\nvar $ = function $(selector) {\n\n  var result = undefined;\n\n  if (selector === 'body') {\n    return document.body;\n  } else if (selector === 'head') {\n    return document.head;\n  } else if (/^[\\#.]?[\\w-]+$/.test(selector)) {\n\n    if (selector[0] === '#') {\n      return document.getElementById(selector.slice(1));\n    } else if (selector[0] === '.') {\n      result = document.getElementsByClassName(selector.slice(1));\n    } else {\n      result = document.getElementsByTagName(selector);\n    }\n  } else {\n    result = document.querySelectorAll(selector);\n  }\n\n  var elements = [].concat(_toConsumableArray(result));\n  if (elements.length === 1) return elements[0];\n  return elements;\n};\nexports.$ = $;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/helpers/util.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/helpers/util.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("/*! http://mths.be/array-from v0.2.0 by @mathias */\nif (!Array.from) {\n\t(function() {\n\t\t'use strict';\n\t\tvar defineProperty = (function() {\n\t\t\t// IE 8 only supports `Object.defineProperty` on DOM elements.\n\t\t\ttry {\n\t\t\t\tvar object = {};\n\t\t\t\tvar $defineProperty = Object.defineProperty;\n\t\t\t\tvar result = $defineProperty(object, object, object) && $defineProperty;\n\t\t\t} catch(error) {}\n\t\t\treturn result || function put(object, key, descriptor) {\n\t\t\t\tobject[key] = descriptor.value;\n\t\t\t};\n\t\t}());\n\t\tvar toStr = Object.prototype.toString;\n\t\tvar isCallable = function(fn) {\n\t\t\t// In a perfect world, the `typeof` check would be sufficient. However,\n\t\t\t// in Chrome 1–12, `typeof /x/ == 'object'`, and in IE 6–8\n\t\t\t// `typeof alert == 'object'` and similar for other host objects.\n\t\t\treturn typeof fn == 'function' || toStr.call(fn) == '[object Function]';\n\t\t};\n\t\tvar toInteger = function(value) {\n\t\t\tvar number = Number(value);\n\t\t\tif (isNaN(number)) {\n\t\t\t\treturn 0;\n\t\t\t}\n\t\t\tif (number == 0 || !isFinite(number)) {\n\t\t\t\treturn number;\n\t\t\t}\n\t\t\treturn (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));\n\t\t};\n\t\tvar maxSafeInteger = Math.pow(2, 53) - 1;\n\t\tvar toLength = function(value) {\n\t\t\tvar len = toInteger(value);\n\t\t\treturn Math.min(Math.max(len, 0), maxSafeInteger);\n\t\t};\n\t\tvar from = function(arrayLike) {\n\t\t\tvar C = this;\n\t\t\tif (arrayLike == null) {\n\t\t\t\tthrow new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');\n\t\t\t}\n\t\t\tvar items = Object(arrayLike);\n\t\t\tvar mapping = arguments.length > 1;\n\n\t\t\tvar mapFn, T;\n\t\t\tif (arguments.length > 1) {\n\t\t\t\tmapFn = arguments[1];\n\t\t\t\tif (!isCallable(mapFn)) {\n\t\t\t\t\tthrow new TypeError('When provided, the second argument to `Array.from` must be a function');\n\t\t\t\t}\n\t\t\t\tif (arguments.length > 2) {\n\t\t\t\t\tT = arguments[2];\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tvar len = toLength(items.length);\n\t\t\tvar A = isCallable(C) ? Object(new C(len)) : new Array(len);\n\t\t\tvar k = 0;\n\t\t\tvar kValue, mappedValue;\n\t\t\twhile (k < len) {\n\t\t\t\tkValue = items[k];\n\t\t\t\tif (mapFn) {\n\t\t\t\t\tmappedValue = typeof T == 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);\n\t\t\t\t} else {\n\t\t\t\t\tmappedValue = kValue;\n\t\t\t\t}\n\t\t\t\tdefineProperty(A, k, {\n\t\t\t\t\t'value': mappedValue,\n\t\t\t\t\t'configurable': true,\n\t\t\t\t\t'enumerable': true\n\t\t\t\t});\n\t\t\t\t++k;\n\t\t\t}\n\t\t\tA.length = len;\n\t\t\treturn A;\n\t\t};\n\t\tdefineProperty(Array, 'from', {\n\t\t\t'value': from,\n\t\t\t'configurable': true,\n\t\t\t'writable': true\n\t\t});\n\t}());\n}\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/array.from/array-from.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/array.from/array-from.js?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }\n\nvar Video = (function () {\n  function Video($el) {\n    _classCallCheck(this, Video);\n\n    this.$el = $el;\n\n    this.$video = this.$el.querySelector('video');\n    this.$canvas = this.$el.querySelector('canvas');\n    this.$meta = this.$el.querySelector('.meta');\n  }\n\n  _createClass(Video, [{\n    key: 'showStream',\n    value: function showStream(stream) {\n      this.stream = stream;\n      this.$video.src = window.URL.createObjectURL(stream);\n    }\n  }, {\n    key: 'removeStream',\n    value: function removeStream() {\n      this.stream = '';\n      this.$video.src = '';\n    }\n  }, {\n    key: 'getVideoElem',\n    value: function getVideoElem() {\n      return this.$video;\n    }\n  }, {\n    key: 'getCanvasElem',\n    value: function getCanvasElem() {\n      return this.$canvas;\n    }\n  }, {\n    key: 'setMeta',\n    value: function setMeta(text) {\n      this.$meta.innerText = text;\n    }\n  }]);\n\n  return Video;\n})();\n\nexports['default'] = Video;\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/modules/Video.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/modules/Video.js?");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("'use strict';\n\nmodule.exports = {\n  'not_ready': 0,\n  'ready': 1,\n  'searching': 2,\n  'paired': 3,\n  'puzzling': 4\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./models/Status.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./models/Status.js?");

/***/ },
/* 6 */
/***/ function(module, exports) {

	eval("'use strict';\n\nmodule.exports = {\n  'mobile': 0,\n  'desktop': 1\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./models/DeviceTypes.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./models/DeviceTypes.js?");

/***/ },
/* 7 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_scss/style.scss\n ** module id = 7\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_scss/style.scss?");

/***/ }
/******/ ]);