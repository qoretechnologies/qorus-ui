// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import Icon from '../icon';

type Props = {
  icon: string;
  iconName?: string;
  children: any;
  style: string;
};

const InfobarItem: Function = ({
  icon,
  iconName,
  children,
  style,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <span className="infobar-item">
    {(icon || iconName) && (
      <Icon icon={icon || iconName} className={style ? `text-${style}` : ''} />
    )}{' '}
    {children}
  </span>
);

export default pure(['icon', 'children'])(InfobarItem);
