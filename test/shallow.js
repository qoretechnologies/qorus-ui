import React from 'react';


/**
 * @param {function(!ReactElement): boolean} predicate
 * @param {!ReactElement} el
 * @return {!Array<!ReactElement>}
 */
function filterTreeInternal(predicate, el) {
  const res = [];

  if (!React.isValidElement(el)) return res;

  if (predicate(el)) res.push(el);

  if (el.props.children) {
    res.push(...React.Children.map(
      el.props.children,
      filterTreeInternal.bind(null, predicate)
    ));
  }

  return res;
}


/**
 * Walks element tree and selects elements complying with predicate.
 *
 * @param {ReactElement} el
 * @param {function(!ReactElement): boolean} predicate
 * @return {!Array<!ReactElement>}
 */
export function filterTree(el, predicate) {
  if (!el) return [];
  if (!React.isValidElement(el)) {
    throw new TypeError(`Expected ${el} to be a React element`);
  }

  return filterTreeInternal(predicate, el);
}
