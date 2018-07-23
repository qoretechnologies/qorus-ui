/* @flow */
import React, { PropTypes } from 'react';

type Props = {
  titleId: string,
  onClose?: Function,
  children: any,
};

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
    <div className="bp3-dialog-header handle">
      <span className="bp3-icon-large bp3-icon-inbox" />
      {props.children && (
        <h5 className="bp3-dialog-header-title" id={props.titleId}>
          {props.children}
        </h5>
      )}

      {props.onClose && (
        <button
          aria-label="Close"
          className="bp3-dialog-close-button bp3-icon-small-cross"
          onClick={props.onClose}
        />
      )}
    </div>
  );
}

Header.propTypes = {
  titleId: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
