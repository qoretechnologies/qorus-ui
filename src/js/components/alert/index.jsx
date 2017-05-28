/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import classNames from 'classnames';

const Alert: Function = ({
  children,
  bsStyle,
}: {
  children?: any,
  bsStyle?: string
}): React.Element<any> => (
  <div
    className={classNames('alert', bsStyle ? `alert-${bsStyle}` : '')}
  >
    {children}
  </div>
);

export default pure(['children', 'bsStyle'])(Alert);
