import { isNumber, isString, curry, get, reduce } from 'lodash';

export function prep (val, des) {
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

export function comparator (key, history, order, c1, c2) {
  // needs speed improvements
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const k10 = prep(get(c1, key));
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const k20 = prep(get(c2, key));
  let r = 1;

  if (order === 'des') r = -1;

  if (k10 < k20) return -1 * r;
  if (k10 > k20) return 1 * r;

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const k11 = prep(get(c1, history[0]));
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const k21 = prep(get(c2, history[0]));

  if (k11 > k21) return -1 * r;
  if (k11 < k21) return 1 * r;
  return 0;
}

export const compare = curry(comparator);

export function slugify (value) {
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

export const whenDefaultEnabled = fn => (ev, ...rest) =>
  !ev.defaultPrevented && fn.apply(this, [ev, ...rest]);

export const countArrayItemsInObject: Function = (obj: Object): number =>
  reduce(obj, (count: number, items: Array<Object>) => count + items.length, 0);

export const countConfigItems: Function = (obj: Object): number =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  reduce(obj, (count: number, items: Object) => count + items.data.length, 0);

export const flattenObject = (obj: Object): Object =>
  Object.assign(
    {},
    ...(function _flatten (o) {
      return [].concat(
        ...Object.keys(o).map(k =>
          typeof o[k] === 'object' ? _flatten(o[k]) : { [k]: o[k] }
        )
      );
    })(obj)
  );
