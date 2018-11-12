/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Icon, Button, ButtonGroup } from '@blueprintjs/core';
import classnames from 'classnames';
import notificationSound from '../../../audio/notification.mp3';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';

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
  notification,
  id,
  notificationsSound,
}: {
  type: 'success' | 'warning' | 'danger' | 'info',
  children?: string,
  onClick: Function,
  onViewClick: Function,
  stack: number,
  notification?: boolean,
  id?: any,
  notificationsSound: boolean,
}): React.Element<any> => (
  <div
    className={classnames('pt-toast', 'pt-overlay-content', {
      [`pt-intent-${type}`]: type !== 'info',
      ['toast-stacked']: stack > 1,
      ['notification-toast']: notification,
      ['info-toast']: !notification,
    })}
    style={{
      cursor: onViewClick ? 'pointer' : 'initial',
    }}
  >
    {notification &&
      notificationsSound && <audio src={notificationSound} id={id} autoPlay />}
    {stack > 1 && (
      <div className="toast-notification-count">{stack > 9 ? '9+' : stack}</div>
    )}
    <Icon iconName={iconByType[type]} />
    <span className="pt-toast-message">{children}</span>
    <ButtonGroup className="pt-minimal">
      {onViewClick && <Button text="View" onClick={onViewClick} />}
      <Button iconName="cross" onClick={onClick} />
    </ButtonGroup>
  </div>
);

export default compose(
  lifecycle({
    componentDidMount() {
      if (this.props.notification) {
        const audioEl: any = document.querySelector(`#${this.props.id}`);

        if (audioEl) {
          audioEl.volume = 0.1;
        }
      }
    },
  }),
  pure(['type', 'children', 'stack'])
)(Bubble);
