/* @flow */
import classNames from 'classnames';
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  icon: string;
  iconName?: string;
  className: string;
  tooltip: string;
  fontSize: number;
};

const Icon: Function = ({
  icon,
  iconName,
  className,
  tooltip,
  fontSize,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <i
    className={classNames('fa', icon || iconName ? `fa-${iconName || icon}` : '', className)}
    title={tooltip}
    style={{
      fontSize: fontSize || null,
    }}
  />
);

export default pure(['icon', 'className', 'tooltip'])(Icon);
