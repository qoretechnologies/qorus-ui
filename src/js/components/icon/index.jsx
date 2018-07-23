/* @flow */
import React from 'react';
import classNames from 'classnames';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  icon: string,
  iconName?: string,
  className: string,
  tooltip: string,
  fontSize: number,
};

const Icon: Function = ({
  icon,
  iconName,
  className,
  tooltip,
  fontSize,
}: Props): React.Element<any> => (
  <i
    className={classNames(
      'fa',
      icon || iconName ? `fa-${iconName || icon}` : '',
      className
    )}
    title={tooltip}
    style={{
      fontSize: fontSize || null,
    }}
  />
);

export default pure(['icon', 'className', 'tooltip'])(Icon);
