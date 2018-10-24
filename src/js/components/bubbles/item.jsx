/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Icon, Button, ButtonGroup } from '@blueprintjs/core';

const iconByType = {
  success: 'small-tick',
  warning: 'info-sign',
  danger: 'warning-sign',
  info: 'info-sign',
};

const Bubble = ({
  type,
  children,
  onClick: handleClick,
}: {
  type: 'success' | 'warning' | 'danger' | 'info',
  children?: string,
  onClick: Function,
}): React.Element<any> => (
  <div
    className={`pt-toast ${
      type === 'info' ? '' : `pt-intent-${type}`
    } pt-overlay-content`}
  >
    <Icon iconName={iconByType[type]} />
    <span className="pt-toast-message">{children}</span>
    <ButtonGroup className="pt-minimal">
      <Button iconName="cross" onClick={handleClick} />
    </ButtonGroup>
  </div>
);

export default pure(['type', 'children'])(Bubble);
