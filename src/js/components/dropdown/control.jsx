/* @flow */
import React from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup } from '@blueprintjs/core';
import mapProps from 'recompose/mapProps';

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
  onClick,
  disabled,
}: Props) => {
  const iconName: ?string = !icon && !children ? 'caret-down' : icon;
  const rightIconName: ?string = !icon && !children ? undefined : 'caret-down';

  console.log(rightIconName);

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
        disabled={disabled}
      />
    </ButtonGroup>
  ) : null;
};

export default mapProps(({ icon, iconName, ...rest }: Props) => ({
  icon: icon || iconName,
  ...rest,
}))(Control);
