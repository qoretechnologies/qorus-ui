/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Callout } from '@blueprintjs/core';
import { getIntentFromBsStyle } from '../../constants/components';

const Alert: Function = ({
  children,
  bsStyle,
  title,
}: {
  children: any,
  bsStyle?: string,
  title?: string,
}): React.Element<any> => (
  <Callout
    intent={getIntentFromBsStyle(bsStyle)}
    iconName="warning-sign"
    title={title}
  >
    {children}
  </Callout>
);

export default pure(['children', 'bsStyle', 'title'])(Alert);
