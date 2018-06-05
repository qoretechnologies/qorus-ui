import React, { PropTypes } from 'react';

/**
 * Simple spinning loading indicator.
 *
 * @return {!ReactElement}
 */
export default function Loader(props) {
  return (
    <div style={{ height: '100%' }}>
      <p className="pt-skeleton" style={{ width: '30%', height: '5%' }} />
      <p className="pt-skeleton" style={{ width: '80%', height: '15%' }} />
      <p className="pt-skeleton" style={{ width: '100%', height: '60%' }} />
      <p className="pt-skeleton" style={{ width: '60%', height: '20%' }} />
    </div>
  );
}

Loader.propTypes = {
  message: PropTypes.string,
};

Loader.defaultProps = {
  message: 'Loading...',
};
