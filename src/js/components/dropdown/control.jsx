/* @flow */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup, Intent } from '@blueprintjs/core';

type Props = {
  children?: React.Element<any>,
  btnStyle: string,
  small?: boolean,
  noCaret?: boolean,
};

export default function Control({ children, small, noCaret }: Props) {
  return (
    <ButtonGroup>
      <Button
        className={classNames(small ? 'pt-small' : '')}
        type="button"
        text={children}
      />
      {!noCaret && (
        <Button
          className={classNames(small ? 'pt-small' : '')}
          iconName="caret-down"
          type="button"
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
