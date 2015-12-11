'use strict';

let _ = require('lodash');

const errors = error => {

  let arr = _.uniq(
    _.pluck(error.data.details, 'path')
  ).map(name => ({[name]: true}));

  return _.merge.apply(null, [{}].concat(arr));

};

module.exports = {
  errors
};
