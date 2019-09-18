// META: global=worker

'use strict';

test(t => {
  assert_throws(new TypeError(), () => new DecompressionStream('a'), 'constructor should throw');
}, 'construction error by unsupported format');

test(t => {
  assert_throws(new TypeError(), () => new DecompressionStream(), 'constructor should throw');
}, 'constructor error by non-input');

test(t => {
  assert_throws(new Error(), () => new DecompressionStream({ toString() { throw Error(); } }), 'constructor should throw');
}, 'constructor error by input object that cannot be converted to a string');
