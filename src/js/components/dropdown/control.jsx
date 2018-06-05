/* @flow */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup, Intent } from '@blueprintjs/core';

type Props = {
  children?: React.Element<any>,
  btnStyle: string,
  small?: boolean,
  noCaret?: boolean,
}

export default function Control({
  children,
  small,
  btnStyle = 'default',
  noCaret,
  ...other,
}: Props) {
  return (
    <Button
      className={classNames(
       small ? 'pt-small' : '',
      )}
      intent={Intent.PRIMARY}
      type="button"
      text={children}
      rightIconName={!noCaret && 'caret-down'}
    />
  );
}

Control.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  btnStyle: PropTypes.string,
  small: PropTypes.bool,
  noCaret: PropTypes.bool,
};
