// META: global=worker,jsshell
// META: script=../resources/rs-utils.js
'use strict';

// Prior to whatwg/stream#870 it was possible to construct a ReadableStreamBYOBRequest directly. This made it possible
// to construct requests that were out-of-sync with the state of the ReadableStream. They could then be used to call
// internal operations, resulting in asserts or bad behaviour. This file contains regression tests for the change.

function getRealByteStreamController() {
  let controller;
  new ReadableStream({
    start(c) {
      controller = c;
    },
    type: 'bytes'
  });
  return controller;
}

const ReadableByteStreamController = getRealByteStreamController().constructor;

// Create an object pretending to have prototype |prototype|, of type |type|. |type| is one of "undefined", "null",
// "fake", or "real". "real" will call the realObjectCreator function to get a real instance of the object.
function createDummyObject(prototype, type, realObjectCreator) {
  switch (type) {
    case 'undefined':
      return undefined;

    case 'null':
      return null;

    case 'fake':
      return Object.create(prototype);

    case 'real':
      return realObjectCreator();
  }

  throw new Error('not reached');
}

const dummyTypes = ['undefined', 'null', 'fake', 'real'];

function runTests(ReadableStreamBYOBRequest) {
  for (const controllerType of dummyTypes) {
    const controller = createDummyObject(ReadableByteStreamController.prototype, controllerType,
                                       getRealByteStreamController);
    for (const viewType of dummyTypes) {
      const view = createDummyObject(Uint8Array.prototype, viewType, () => new Uint8Array(16));
      test(() => {
        assert_throws_js(TypeError, () => new ReadableStreamBYOBRequest(controller, view),
                         'constructor should throw');
      }, `ReadableStreamBYOBRequest constructor should throw when passed a ${controllerType} ` +
         `ReadableByteStreamController and a ${viewType} view`);
    }
  }
}

function getConstructorAndRunTests() {
  let ReadableStreamBYOBRequest;
  const rs = new ReadableStream({
    pull(controller) {
      const byobRequest = controller.byobRequest;
      ReadableStreamBYOBRequest = byobRequest.constructor;
      byobRequest.respond(4);
    },
    type: 'bytes'
  });
  rs.getReader({ mode: 'byob' }).read(new Uint8Array(8)).then(() => {
    runTests(ReadableStreamBYOBRequest);
    done();
  });
}

// We can only get at the ReadableStreamBYOBRequest constructor asynchronously, so we need to make the test harness wait
// for us to explicitly tell it all our tests have run.
setup({ explicit_done: true });

getConstructorAndRunTests();
