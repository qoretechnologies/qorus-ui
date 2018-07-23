// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import Icon from '../icon';

type Props = {
  icon: string,
  iconName?: string,
  children: any,
  style: string,
};

const InfobarItem: Function = ({
  icon,
  iconName,
  children,
  style,
}: Props): React.Element<any> => (
  <span className="infobar-item">
    {(icon || iconName) && (
      <Icon
        iconName={icon || iconName}
        className={style ? `text-${style}` : ''}
      />
    )}{' '}
    {children}
  </span>
);

export default pure(['icon', 'children'])(InfobarItem);
