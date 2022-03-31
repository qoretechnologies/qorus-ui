/* @flow */
import { Button, ButtonGroup } from '@blueprintjs/core';
import React from 'react';

type Props = {
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  children?;
  btnStyle: string;
  small?: boolean;
  noCaret?: boolean;
  intent?: string;
  icon?: string;
  iconName?: string;
  onClick: Function;
  disabled?: boolean;
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
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  const newIcon: string = icon || iconName;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  const newIconName: string = !newIcon && !children ? 'caret-down' : newIcon;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  const rightIconName: string = !newIcon && !children ? undefined : 'caret-down';

  return children || newIcon || !noCaret ? (
    <ButtonGroup>
      <Button
        small
        type="button"
        text={children}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
        intent={intent}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
        icon={newIconName}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
        rightIcon={!noCaret ? rightIconName : null}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
        onClick={onClick}
        disabled={disabled}
      />
    </ButtonGroup>
  ) : null;
};

Control.displayName = 'DropdownControl';

export default Control;
