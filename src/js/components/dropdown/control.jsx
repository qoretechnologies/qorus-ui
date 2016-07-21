/* @flow */
import React, { PropTypes } from 'react';
import classNames from 'classnames';

type Props = {
  children?: React.Element<any>,
  btnStyle?: string,
  small?: boolean,
}

export default function Control(props: Props) {
  return (
    <button
      className={classNames('btn',
       props.small ? 'btn-xs' : '',
       props.btnStyle ? `btn-${props.btnStyle}` : 'btn-default',
       'dropdown-toggle'
      )}
      {...props}
    >
      { props.children }
      {' '}
      <span className="fa fa-caret-down" />
    </button>
  );
}

Control.propTypes = {
  children: PropTypes.node,
  btnStyle: PropTypes.string,
  small: PropTypes.bool,
};
