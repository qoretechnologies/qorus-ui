/* @flow */
import React, { PropTypes } from 'react';

type Props = {
  titleId: string,
  onClose?: Function,
  children: any,
}

/**
 * Modal header with title, title HTML ID and close button.
 *
 * Title HTML ID is for ARIA in connection with the whole modal
 * pane. Title itself is represented by children.
 *
 * @param {!{
 *   titleId: string,
 *   onClose: ?function,
 *   children: ReactNode,
 * }} props
 * @return {!ReactElement}
 */
export default function Header(props: Props) {
  return (
    <div className="modal-header">
      {props.onClose && (
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={props.onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
      {props.children && (
        <h4 className="modal-title" id={props.titleId}>
          {props.children}
        </h4>
      )}
    </div>
  );
}

Header.propTypes = {
  titleId: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
