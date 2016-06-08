import React, { PropTypes } from 'react';

/**
 * Simple spinning loading indicator.
 *
 * @return {!ReactElement}
 */
export default function Loader(props) {
  return (
    <p><i className="fa fa-spinner fa-spin" /> { props.message }</p>
  );
}

Loader.propTypes = {
  message: PropTypes.string,
};

Loader.defaultProps = {
  message: 'Loading...',
};
