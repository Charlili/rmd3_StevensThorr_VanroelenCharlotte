'use strict';

let moment = require('moment');

module.exports = date => moment(date).format('HH:mm D/M/YYYY');
