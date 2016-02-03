/* eslint no-proto: 0 */

/**
 * @fileoverview Babel fix for IE10
 *
 * Fixes issue where Babel cannot find object's prototype in browsers
 * without `__proto__`. This operation most visibly occurs during
 * `super` call in constructor and affects IE10 which we support.
 *
 * @see https://phabricator.babeljs.io/T3041
 * @see https://github.com/seznam/IMA.js-babel6-polyfill
 */

if (!(Object.setPrototypeOf || {}.__proto__)) {
  const nativeGetPrototypeOf = Object.getPrototypeOf;

  Object.getPrototypeOf = (object) => (
    object.__proto__ || nativeGetPrototypeOf.call(Object, object)
  );
}
