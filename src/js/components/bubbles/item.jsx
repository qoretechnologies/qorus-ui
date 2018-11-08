/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Icon, Button, ButtonGroup } from '@blueprintjs/core';
import classnames from 'classnames';

const iconByType = {
  success: 'small-tick',
  warning: 'info-sign',
  danger: 'warning-sign',
  info: 'notifications',
};

const Bubble = ({
  type,
  children,
  onClick,
  onViewClick,
  stack,
}: {
  type: 'success' | 'warning' | 'danger' | 'info',
  children?: string,
  onClick: Function,
  onViewClick: Function,
  stack: number,
}): React.Element<any> => (
  <div
    className={classnames('pt-toast', 'pt-overlay-content', {
      [`pt-intent-${type}`]: type !== 'info',
      ['toast-stacked']: stack > 1,
    })}
    onClick={onViewClick}
    style={{
      cursor: onViewClick ? 'pointer' : 'initial',
    }}
  >
    {stack > 1 && (
      <div className="toast-notification-count">{stack > 9 ? '9+' : stack}</div>
    )}
    <Icon iconName={iconByType[type]} />
    <span className="pt-toast-message">{children}</span>
    <ButtonGroup className="pt-minimal">
      {onViewClick && <Button text="View" />}
      <Button iconName="cross" onClick={onClick} />
    </ButtonGroup>
  </div>
);

export default pure(['type', 'children', 'stack'])(Bubble);
