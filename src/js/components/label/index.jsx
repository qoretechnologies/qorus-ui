/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import classNames from 'classnames';

const Label = (
  { style = '', children }: { style?: string, children?: string }
) => (
  <span
    className={classNames({
      label: true,
      [`label-${style}`]: !!style,
    })}
  >
    {children}
  </span>
);

export default pure(['style', 'children'])(Label);
