'use strict';

let Status = require('../models/Status');
let PuzzleStages = require('../models/PuzzleStages.js');

class Client {

  constructor(id, strDeviceType, socketid){
    this.id = id;
    this.socketid = socketid;
    this.pairedid = '';
    this.devicename = `${strDeviceType}_${this.id}`;
    this.type = strDeviceType;
    this.status = Status.not_ready;
    this.puzzlestage = PuzzleStages.pairing_omnitool;
  }

}

module.exports = Client;
