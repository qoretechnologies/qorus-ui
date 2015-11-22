import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Key position in default key-value pair record structure.
 */
const KEY = 0;

/**
 * Value position in default key-value pair record structure.
 */
const VAL = 1;


/**
 * Column specification component.
 *
 * This is a meta component to specify how table or table section data
 * will be rendered. It renders nothing itself.
 *
 * By default, it suggests rendering no heading cell, use DOM td
 * element for data cell and renders one record property per column.
 *
 * The default behavior expects records to be defined as [[key,
 * value], ...] structure similar to Map build-in object. It can be
 * changed by props comp which is transformation function which
 * expects record, record index in data and column index in table.
 */
@pureRender
export default class Col extends Component {
  static propTypes = {
    heading: PropTypes.string,
    comp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    props: PropTypes.func
  }

  static defaultProps = {
    heading: '',
    comp: 'td',
    props: (rec, recIdx, colIdx) => (
      { [rec[colIdx][KEY]]: rec[colIdx][VAL] }
    )
  }

  render() {
    return null;
  }
}
