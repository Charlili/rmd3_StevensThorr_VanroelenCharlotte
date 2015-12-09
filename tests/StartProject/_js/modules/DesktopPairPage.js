'use strict';

import SocketPage from './SocketPage';
import Status from '../../models/Status';

import {redirectToPage} from '../helpers/util';

export default class DesktopPairPage extends SocketPage{

  constructor(socket, clientDetails){

    super(socket);

    // -- Class Variable -------------
    this.clientDetails = clientDetails;
    this.socket = socket;

    // -- Element Variables ----------
    this.$meta = document.querySelector('.meta');
    this.$passcode = document.querySelector('.passcode');
    this.$qrcode = document.querySelector('.QRCode');

    // -- Element Manipulation -------
    this.$passcode.innerText = this.clientDetails.passcode;

    // -- Event Handlers -------------
    this.socket.on('paired', (pairedid) => this.pairedHandler(pairedid));

  }

  init(){

    console.log('[DesktopPairPage] Initialising');

    this.createQR();
    super.setStatus(Status.ready);

  }

  createQR(){

    console.log('[DesktopPairPage] Creating QR Code');

    this.$qrcode.setAttribute('src', `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${this.socket.id}`);
    this.$meta.innerText = `SocketID: ${this.socket.id} // Open with phone and scan to pair`;

    super.setStatus('searching');

  }

  pairedHandler(pairedid){

    console.log('[DesktopPairPage] Paired with Phone');

    this.socket.emit('setPaired', pairedid);

    super.setStatus('paired');

    this.$meta.innerText = `Socket_ID: ${this.socket.id} // Paired with: ${pairedid}`;

    redirectToPage(`d/${this.clientDetails.refcode}/mapsynch`);

  }

}
