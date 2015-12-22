'use strict';

let fs = require('fs');

module.exports = [

  {
    method: 'GET',
    path: '/api/puzzles',
    handler: function(request, reply){

      fs.readFile('./data/puzzles.json', 'utf-8', (err, data) => {

        if(err){
          console.error(err);
        }

        reply(JSON.parse(data));

      });

    }
  },

  {
    method: 'GET',
    path: '/api/puzzles/{puzzle_id}',
    handler: function(request, reply){

      fs.readFile('./data/puzzles.json', 'utf-8', (err, data) => {

        if(err){
          console.error(err);
        }

        let puzzles = JSON.parse(data);
        let puzzleId = request.url.path.split('/')[3] - 1;

        reply(puzzles.puzzles[puzzleId]);

      });

    }
  }

];
