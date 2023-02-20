var Queue = require("./queue");
var findQueue = new Queue("chess");
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
const {
  isMainThread, parentPort
} = require('node:worker_threads');
var pair1 = null;
var pair2 = null;
if (!isMainThread) {
  parentPort.on('message', (message) => {
    if (message.find) {
      findQueue.enqueue(message.find);
    }
    if (message.cancel) {
      if (pair1==message.cancel) { pair1 = pair2; pair2 = null; }
      if (pair2==message.cancel) { pair2 = null; }
      findQueue.remove(message.cancel);
      parentPort.postMessage({cancel: message.cancel});
    }
  });
  run();
}

async function run() {
  while (true) {
    if (pair1===null) {
      pair1 = await getQueue();
    } else {
      pair2 = await getQueue();
    }
    await snooze(200);
    if (pair2!==null) {
      parentPort.postMessage({p1: pair1, p2: pair2});
      pair1 = null;
      pair2 = null;
    }
  }
}

async function getQueue() {
  let result = findQueue.dequeueRandom();
  return Promise.resolve(result);
}