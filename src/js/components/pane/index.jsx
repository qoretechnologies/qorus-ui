import React, { PropTypes } from 'react';
import ResizeHandle from '../resize/handle';


/**
 * Pane flowing above other content sticked to the right.
 *
 * It also has convenient close button.
 *
 * @param {!{
 *   titleId: string,
 *   onClose: ?function,
 *   children: ReactNode,
 * }} props
 * @return {!ReactElement}
 */
export default function Pane(props) {
  return (
    <div
      className="pane right"
      style={{ width: props.width }}
    >
      <button
        type="button"
        className="btn btn-xs btn-inverse pane__close"
        onClick={props.onClose}
      >
        <i className="fa fa-times-circle" /> Close
      </button>
      <div className="pane__content">
        {props.children}
      </div>
      <ResizeHandle left min={{ width: 400 }} />
    </div>
  );
}

Pane.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  width: PropTypes.number,
};
