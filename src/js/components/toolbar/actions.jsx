import React, { PropTypes } from 'react';

/**
 * Renders the action buttons when one
 * or more worfklows are selected
 *
 * @param {!Object} props
 * @returns {!ReactElement}
 */
export default function Actions(props) {
  return (
    <div className="btn-group" id="selection-actions">
      { props.children }
    </div>
  );
}

Actions.propTypes = {
  children: PropTypes.node,
};
