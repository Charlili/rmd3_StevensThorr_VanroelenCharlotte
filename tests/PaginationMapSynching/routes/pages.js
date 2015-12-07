'use strict';

module.exports = [

  /*{
    method: 'GET',
    path: '/test',
    handler: (request, reply) => {
      let students = {
        students: [
          {
            name: 'Thorr',
            lastname: 'Stevens'
          }
        ]
      };
      return reply(students);
    }
  },*/

  {
    method: 'GET',
    path: '/d/{ref_id}',
    handler: (request, reply) => {
      return reply.view('desktop');
    }
  },

  {
    method: 'GET',
    path: '/m/{ref_id}',
    handler: (request, reply) => {
      return reply.view('mobile');
    }
  },

  {
    method: 'GET',
    path: '/m/{pairedid}/pair',
    handler: (request, reply) => {
      return reply.view('mobile');
    }
  },

  {
    method: 'GET',
    path: '/connect',
    handler: (request, reply) => {
      return reply.view('connect');
    }
  },

  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => reply.redirect('/connect')
  }

];
