/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Callout } from '@blueprintjs/core';
import { getIntentFromBsStyle } from '../../constants/components';

const Alert: Function = ({
  children,
  bsStyle,
  title,
  iconName: iconName = 'warning-sign',
}: {
  children: any,
  bsStyle?: string,
  title?: string,
  iconName?: string,
}): React.Element<any> => (
  <Callout
    intent={getIntentFromBsStyle(bsStyle)}
    iconName={iconName}
    title={title}
  >
    {children}
  </Callout>
);

export default pure(['children', 'bsStyle', 'title'])(Alert);
