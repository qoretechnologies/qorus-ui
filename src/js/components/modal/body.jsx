import React, { PropTypes } from 'react';


/**
 * Wrapper for modal main content.
 *
 * @param {!{ children: ReactNode }} props
 * @return {!ReactElement}
 */
export default function Body(props) {
  return (
    <div className="modal-body">
      {props.children}
    </div>
  );
}

Body.propTypes = {
  children: PropTypes.node,
};
