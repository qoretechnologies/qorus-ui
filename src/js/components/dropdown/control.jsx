/* @flow */
import React, { PropTypes } from 'react';
import classNames from 'classnames';

type Props = {
  children?: React.Element<any>,
  btnStyle: string,
  small?: boolean,
  noCaret?: boolean
}

export default function Control(
  { children, small = false, btnStyle = '', noCaret = false, ...other }: Props
) {
  return (
    <button
      className={classNames('btn',
       small ? 'btn-xs' : '',
       `btn-${btnStyle}`,
       'dropdown-toggle'
      )}
      {...other}
    >
      { children }
      { !noCaret ? ' ' : null }
      { !noCaret ? <span className="fa fa-caret-down" /> : null }
    </button>
  );
}

Control.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  btnStyle: PropTypes.string,
  small: PropTypes.bool,
  noCaret: PropTypes.bool,
};
