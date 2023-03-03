'use strict';

class Queue {
  constructor(){
    this.data = {};
  }

  store(key, value){
    this.data[key] = value;
    console.log(value, '[server/lib/queue.js 10] something was added to the queue');
    return key;
  }

  read(key){
    return this.data[key];
  }

  remove(key){
    console.log('[server/lib/queue.js 19] something was removed from queue');
    let value = this.data[key];
    delete this.data[key];
    return value;
  }
}

module.exports = Queue;
