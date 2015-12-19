'use strict';

import {redirectToPage} from '../helpers/util';

export default class Intro{

  constructor(el){
    this.el = el;
    this.button = el.querySelector('a');
  }

  init(){

    this.button.addEventListener('click', this.clickHandler);

  }

  clickHandler(e){
    e.preventDefault();
    console.log('Hello');
    redirectToPage('scan');
  }

}
