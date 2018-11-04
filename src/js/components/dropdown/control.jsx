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
  return (
    <ButtonGroup>
      <Button
        className={classNames(small ? 'pt-small' : '')}
        type="button"
        text={children}
        intent={intent}
        iconName={icon}
        onClick={onClick}
      />
      {!noCaret && (
        <Button
          className={classNames(small ? 'pt-small' : '')}
          iconName="caret-down"
          type="button"
          intent={intent}
          onClick={onClick}
        />
      )}
    </ButtonGroup>
  );
}
