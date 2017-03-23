/* @flow */
import React from 'react';
import classNames from 'classnames';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  icon: string,
  className: string,
  tooltip: string,
}

const Icon: Function = ({ icon, className, tooltip }: Props): React.Element<any> => (
  <i
    className={classNames('fa', icon ? `fa-${icon}` : '', className)}
    title={tooltip}
  />
);

export default pure(['icon', 'className', 'tooltip'])(Icon);
