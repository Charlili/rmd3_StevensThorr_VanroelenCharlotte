'use strict';

export default class Video{

  constructor($el){

    this.$el = $el;

    this.$video = this.$el.querySelector('video');
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

  setMeta(text){
    this.$meta.innerText = text;
  }

}
