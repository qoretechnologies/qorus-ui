/* @flow */
import React from 'react';
import classNames from 'classnames';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  icon: string,
  className: string,
  tooltip: string,
  fontSize: number,
};

const Icon: Function = ({
  icon,
  className,
  tooltip,
  fontSize,
}: Props): React.Element<any> => (
  <i
    className={classNames('fa', icon ? `fa-${icon}` : '', className)}
    title={tooltip}
    style={{
      fontSize: fontSize || null,
    }}
  />
);

export default pure(['icon', 'className', 'tooltip'])(Icon);
