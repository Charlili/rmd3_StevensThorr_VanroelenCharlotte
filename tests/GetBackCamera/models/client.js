'use strict';

let Status = require('../models/Status');

module.exports = {
  status: Status.not_ready,
  socketId: '',
  peerId: ''
};
