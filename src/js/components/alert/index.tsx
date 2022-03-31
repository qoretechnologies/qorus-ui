/* @flow */
import { Callout } from '@blueprintjs/core';
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { getIntentFromBsStyle } from '../../constants/components';

const Alert: Function = ({
  children,
  bsStyle,
  title,
  className,
  iconName = 'warning-sign',
}: {
  children: any;
  bsStyle?: string;
  title?: string;
  iconName?: string;
  className?: string;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<any> => (
  <Callout
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
    intent={getIntentFromBsStyle(bsStyle)}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
    icon={iconName}
    title={title}
    className={className}
  >
    {children}
  </Callout>
);

export default pure(['children', 'bsStyle', 'title'])(Alert);
