class Queue {
    constructor(own) {
      this.collection = [];
      this._owner = own;
    }
    get length() {
      return this.collection.length;
    }
    get owner() {
      return this._owner;
    }
    enqueue(element) {
      if (this.hasOwner()) {
        this.collection.push(element);
      }
    }
    enqueueByOwner(owner, element) {
      if (this.hasOwner() && this.isOwnedBy(owner)) {
        this.collection.push(element);
      }
    }
    dequeue() {
      if (this.hasOwner() && !this.isEmpty()) {
        return this.collection.shift();
      }
      return null;
    }
    dequeueByOwner(owner) {
      if (this.hasOwner && !this.isEmpty() &&
          this.isOwnedBy(owner)) {
        return this.collection.shift();
      }
      return null;
    }
    front() {
      if (this._owner!==null) {
        return this.collection[0];
      }
    }
    size() {
      return this.collection.length;
    }
    isEmpty() {
      return (this.collection.length===0);
    }
    isNotEmpty() {
      return (this.collection.length>0);
    }
    clear() {
      this.collection.length = 0;
    }
    setOwner(owner) {
      if (this._owner!==owner) {
        this.clear();
        this._owner = owner;
      }
    };
    equals(queue) {
      return (this.hasOwner() && this._owner===queue.owner);
    }
    isOwnedBy(owner) {
      return (this.hasOwner() && this._owner===owner);
    }
    transferQueue(queue) {
      this.setOwner(queue.owner);
      while (!queue.isEmpty()) {
        this.enqueue(queue.dequeue());
      }
      queue.setOwner(null);
    }
    hasOwner() {
      return (this._owner!==null);
    }
    remove(value) {
      if (this.hasOwner() && this.collection.includes(value)) {
        this.collection.splice(this.collection.indexOf(value), 1);
        return true;
      }
      return false;
    }
    dequeueRandom() {
      if (this.hasOwner && this.isNotEmpty()) {
        let rand = Math.floor(Math.random() * this.collection.length);
        return this.collection.splice(rand, 1)[0];
      }
      return null;
    }
    toString() {
      return "Queue(owner="+this.owner+", data=["+this.collection+"])";
    }
  }
  
  module.exports = Queue;