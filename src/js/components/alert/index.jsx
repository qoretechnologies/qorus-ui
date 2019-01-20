/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Callout } from '@blueprintjs/core';
import { getIntentFromBsStyle } from '../../constants/components';

const Alert: Function = ({
  children,
  bsStyle,
  title,
  className,
  iconName: iconName = 'warning-sign',
}: {
  children: any,
  bsStyle?: string,
  title?: string,
  iconName?: string,
  className?: string,
}): React.Element<any> => (
  <Callout
    intent={getIntentFromBsStyle(bsStyle)}
    iconName={iconName}
    title={title}
    className={className}
  >
    {children}
  </Callout>
);

export default pure(['children', 'bsStyle', 'title'])(Alert);
