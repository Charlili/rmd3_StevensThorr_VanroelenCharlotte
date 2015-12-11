'use strict';

export default class Video{

  constructor($el){

    this.$el = $el;

    this.$video = this.$el.querySelector('video');
    this.$canvas = this.$el.querySelector('canvas');
    this.$meta = this.$el.querySelector('.meta');

  }

  showStream(stream){
    this.stream = stream;
    this.$video.src = window.URL.createObjectURL(stream);
  }

  removeStream(){
    this.stream = '';
    this.$video.src = '';
  }

  getVideoElem(){
    return this.$video;
  }

  getCanvasElem(){
    return this.$canvas;
  }

  setMeta(text){
    this.$meta.innerText = text;
  }

}
