import React, { PropTypes } from 'react';
import classNames from 'classnames';

/**
 * @param {!Object} props
 * @return {!ReactElement}
 */
export default function Control(props) {
  return (
    <button
      className={classNames('btn',
       props.small ? 'btn-xs' : '',
       `btn-${props.btnStyle}`,
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

Control.defaultProps = {
  btnStyle: 'default',
};

Control.propTypes = {
  children: PropTypes.node,
  btnStyle: PropTypes.string,
  small: PropTypes.bool,
};
