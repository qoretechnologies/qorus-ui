import isNumber from 'lodash/lang/isNumber';
import isString from 'lodash/lang/isString';
import curry from 'lodash/function/curry';
import get from 'lodash/object/get';


export function prep(val, des) {
  let returnVal;

  if (isNumber(val)) {
    returnVal = String('00000000000000' + val).slice(-14);
  } else if (isString(val)) {
    returnVal = val.toLowerCase();
  }
  if (des === true) {
    return `-${returnVal}`;
  }
  return returnVal;
}

export function comparator(key, history, order, c1, c2) {
  // needs speed improvements
  const k10 = prep(get(c1, key));
  const k20 = prep(get(c2, key));
  let r = 1;
  let k11;
  let k21;

  if (order === 'des') r = -1;

  if (k10 < k20) return -1 * r;
  if (k10 > k20) return 1 * r;

  k11 = prep(get(c1, history[0]));
  k21 = prep(get(c2, history[0]));

  if (k11 > k21) return -1 * r;
  if (k11 < k21) return 1 * r;
  return 0;
}

export const compare = curry(comparator);


export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\-|\_+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

export const preventDefault = fn => (...args) => {
  args[0].preventDefault();
  return fn(...args);
};

export const whenDefaultEnabled = fn => (...args) => {
  const ev = args[0];
  if (!ev.defaultPrevented) {
    return fn(...args);
  }
};
