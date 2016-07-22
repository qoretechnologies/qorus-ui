/* @flow */
import { PropTypes } from 'react';
import { compose } from 'redux';

import loadIfUndefined from './load-if-undefined';
import showIfDefined from './show-if-defined';

export default (propName: string, propType: any) => compose(
  loadIfUndefined(propName, propType),
  showIfDefined(propName, propType)
);
