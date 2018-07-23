/* @flow */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup } from '@blueprintjs/core';

type Props = {
  children?: React.Element<any>,
  btnStyle: string,
  small?: boolean,
  noCaret?: boolean,
  intent?: string,
  icon?: string,
};

export default function Control({
  children,
  small,
  noCaret,
  intent,
  icon,
}: Props) {
  return (
    <ButtonGroup>
      <Button
        className={classNames(small ? 'pt-small' : '')}
        type="button"
        text={children}
        intent={intent}
        iconName={icon}
      />
      {!noCaret && (
        <Button
          className={classNames(small ? 'pt-small' : '')}
          iconName="caret-down"
          type="button"
          intent={intent}
        />
      )}
    </ButtonGroup>
  );
}

Control.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  btnStyle: PropTypes.string,
  small: PropTypes.bool,
  noCaret: PropTypes.bool,
};
