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
    <div className="pt-dialog-header handle">
      <span className="pt-icon-large pt-icon-inbox" />
      {props.children && (
        <h5 className="pt-dialog-header-title" id={props.titleId}>
          {props.children}
        </h5>
      )}

      {props.onClose && (
        <button
          aria-label="Close"
          className="pt-dialog-close-button pt-icon-small-cross"
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
