'use strict';

module.exports = [

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
  },

  /* --- Desktop Routing -------------------------------------------- */

  {
    method: 'GET',
    path: '/d/{ref_id}',
    handler: (request, reply) => {
      return reply.view('desktop');
    }
  },

  {
    method: 'GET',
    path: '/d/{ref_id}/mapsynch',
    handler: (request, reply) => {
      return reply.view('dMapSynch');
    }
  },

  /* --- Mobile Routing -------------------------------------------- */

  {
    method: 'GET',
    path: '/m/{paired_id}/pair',
    handler: (request, reply) => {
      return reply.view('mobile');
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
    path: '/m/{ref_id}/mapsynch',
    handler: (request, reply) => {
      return reply.view('mMapSynch');
    }
  }

];
