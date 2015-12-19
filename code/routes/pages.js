'use strict';

module.exports = [



  {
    method: 'GET',
    path: '/intro',
    handler: (request, reply) => reply.view('intro')
  },

  {
    method: 'GET',
    path: '/scan',
    handler: (request, reply) => reply.view('connect')
  },

  {
    method: 'GET',
    path: '/connect',
    handler: (request, reply) => {
      return reply.view('connect');
    }
  },

  /*{
    method: 'GET',
    path: '/',
    handler: (request, reply) => reply.redirect('/connect')
  },*/

  /* --- Desktop Routing -------------------------------------------- */

  {
    method: 'GET',
    path: '/d/{ref_id}',
    handler: (request, reply) => {
      return reply.view('DesktopPairPage');
    }
  },

  {
    method: 'GET',
    path: '/d/{ref_id}/mapsync',
    handler: (request, reply) => {
      return reply.view('DesktopMapSyncPage');
    }
  },

  /* --- Mobile Routing -------------------------------------------- */

  {
    method: 'GET',
    path: '/m/{paired_id}/pair',
    handler: (request, reply) => {
      return reply.view('MobilePairPage');
    }
  },

  {
    method: 'GET',
    path: '/m/{ref_id}',
    handler: (request, reply) => {
      return reply.view('MobilePairPage');
    }
  },

  {
    method: 'GET',
    path: '/m/{ref_id}/mapsync',
    handler: (request, reply) => {
      return reply.view('MobileMapSyncPage');
    }
  }

];
