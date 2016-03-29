import React, { PropTypes } from 'react';


/**
 * Workflow table toolbar.
 *
 * The toolbar controls are children.
 *
 * @parma {!{ children: ReactNode }} props
 * @return {ReactElement}
 */
export default function Toolbar(props) {
  return (
    <div id="workflows-toolbar" className="btn-toolbar toolbar" role="toolbar">
      <div className="workflows-toolbar btn-toolbar sticky toolbar">
        {props.children}
      </div>
    </div>
  );
}

Toolbar.propTypes = {
  children: PropTypes.node,
};
