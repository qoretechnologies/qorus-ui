import React, { PropTypes } from 'react';

/**
 * @param {!Object} props
 * @return {!ReactElement}
 */
export default function Control(props) {
  return (
    <button
      className="btn btn-default dropdown-toggle"
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
};
