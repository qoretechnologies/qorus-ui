/* @flow */
import React from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup } from '@blueprintjs/core';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';

type Props = {
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  const newIcon: ?string = icon || iconName;
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  const newIconName: ?string = !newIcon && !children ? 'caret-down' : newIcon;
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  const rightIconName: ?string =
    !newIcon && !children ? undefined : 'caret-down';

  return children || newIcon || !noCaret ? (
    <ButtonGroup>
      <Button
        small
        type="button"
        text={children}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
        intent={intent}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
        icon={newIconName}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
        rightIcon={!noCaret ? rightIconName : null}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
        onClick={onClick}
        disabled={disabled}
      />
    </ButtonGroup>
  ) : null;
};

Control.displayName = 'DropdownControl';

export default Control;
