/* @flow */
import React from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup } from '@blueprintjs/core';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';

type Props = {
  children?: React.Element<any>,
  btnStyle: string,
  small?: boolean,
  noCaret?: boolean,
  intent?: string,
  icon?: string,
  iconName?: string,
  onClick: Function,
  disabled?: boolean,
};

const Control = ({
  children,
  small,
  noCaret,
  intent,
  icon,
  iconName,
  onClick,
  disabled,
}: Props) => {
  const newIcon: ?string = icon || iconName;
  const newIconName: ?string = !newIcon && !children ? 'caret-down' : newIcon;
  const rightIconName: ?string =
    !newIcon && !children ? undefined : 'caret-down';

  return children || newIcon || !noCaret ? (
    <ButtonGroup>
      <Button
        small
        type="button"
        text={children}
        intent={intent}
        icon={newIconName}
        rightIcon={!noCaret ? rightIconName : null}
        onClick={onClick}
        disabled={disabled}
      />
    </ButtonGroup>
  ) : null;
};

Control.displayName = 'DropdownControl';

export default Control;
