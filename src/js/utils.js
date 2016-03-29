import { isNumber, isString, curry, get } from 'lodash';


export function prep(val, des) {
  let returnVal;

  if (isNumber(val)) {
    returnVal = String(`00000000000000${val}`).slice(-14);
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

  if (order === 'des') r = -1;

  if (k10 < k20) return -1 * r;
  if (k10 > k20) return 1 * r;

  const k11 = prep(get(c1, history[0]));
  const k21 = prep(get(c2, history[0]));

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

export const preventDefault = fn => (ev, ...rest) => {
  ev.preventDefault();
  return fn.apply(this, [ev, ...rest]);
};

export const whenDefaultEnabled = fn => (ev, ...rest) => (
  !ev.defaultPrevented && fn.apply(this, [ev, ...rest])
);
