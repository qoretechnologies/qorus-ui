/* @flow */
import React from 'react';

import {
  Button,
  Icon
} from '@blueprintjs/core';

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
      <Icon icon="inbox" />
      {props.children && (
        <h5 className="bp3-heading" id={props.titleId}>
          {props.children}
        </h5>
      )}
      {props.onClose && (
        <Button
          className="bp3-dialog-close-button bp3-button bp3-minimal"
          icon="cross"
          onClick={props.onClose}
        />
      )}
    </div>
  );
}
