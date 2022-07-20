/* @flow */
import { Button, ButtonGroup, Icon } from '@blueprintjs/core';
import classnames from 'classnames';
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/onlyUpdateForKeys';
import notificationSound from '../../../audio/notification.mp3';

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
  type: 'success' | 'warning' | 'danger' | 'info';
  children?: string;
  onClick: Function;
  onViewClick: Function;
  stack: number;
  notification?: boolean;
  id?: any;
  notificationsSound: boolean;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}) => (
  <div
    className={classnames('bp3-toast', 'bp3-overlay-content', {
      [`bp3-intent-${type}`]: type !== 'info',
      'toast-stacked': stack > 1,
      'notification-toast': notification,
      'info-toast': !notification,
    })}
    style={{
      cursor: onViewClick ? 'pointer' : 'initial',
    }}
  >
    {notification && notificationsSound && (
      <audio src={notificationSound} id={id && `audio_${id}`} autoPlay />
    )}
    {stack > 1 && <div className="toast-notification-count">{stack > 9 ? '9+' : stack}</div>}
    {/* @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message */}
    <Icon icon={iconByType[type]} />
    <span className="bp3-toast-message">{children}</span>
    <ButtonGroup className="bp3-minimal">
      {/* @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message */}
      {onViewClick && <Button text="View" onClick={onViewClick} />}
      {/* @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message */}
      <Button icon="cross" onClick={onClick} />
    </ButtonGroup>
  </div>
);

export default compose(
  lifecycle({
    componentDidMount() {
      if (this.props.notification) {
        const audioEl: any = document.querySelector(`#audio_${this.props.id}`);

        if (audioEl) {
          audioEl.volume = 0.1;
        }
      }
    },
  }),
  pure(['type', 'children', 'stack'])
)(Bubble);
