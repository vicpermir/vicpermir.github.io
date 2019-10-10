'use strict';

var name = null;

self.addEventListener(
  'message',
  function(event){
    if (event.data.hasOwnProperty('id')) {
      name = 'worker_' + event.data.id;
    }
    var messageToMain = self.name + ' received: ' + event.data.msg;
    self.postMessage({'msg': messageToMain});
  },
  false
);

var randWait = Math.floor(Math.random() * 2000) + 2000;
setTimeout(
  function(){
    self.postMessage({'msg': "Hi, I'm " + self.name + " (random delayed reply after init)"});
  },
  randWait
);
