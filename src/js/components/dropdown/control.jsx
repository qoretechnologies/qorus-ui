/* @flow */
import React from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup } from '@blueprintjs/core';

type Props = {
  children?: React.Element<any>,
  btnStyle: string,
  small?: boolean,
  noCaret?: boolean,
  intent?: string,
  icon?: string,
  onClick: Function,
};

export default function Control({
  children,
  small,
  noCaret,
  intent,
  icon,
  onClick,
}: Props) {
  const iconName: ?string = !icon && !children ? 'caret-down' : icon;
  const rightIconName: ?string = !icon && !children ? undefined : 'caret-down';

  return children || icon || !noCaret ? (
    <ButtonGroup>
      <Button
        className={classNames(small ? 'pt-small' : '')}
        type="button"
        text={children}
        intent={intent}
        iconName={iconName}
        rightIconName={!noCaret ? rightIconName : null}
        onClick={onClick}
      />
    </ButtonGroup>
  ) : null;
}
