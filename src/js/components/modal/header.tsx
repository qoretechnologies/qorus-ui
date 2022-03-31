/* @flow */
import { Button, Icon } from '@blueprintjs/core';
import React from 'react';

type Props = {
  titleId: string;
  onClose?: Function;
  children: any;
};

/**
 * Modal header with title, title HTML ID and close button.
 *
 * Title HTML ID is for ARIA in connection with the whole modal
 * pane. Title itself is represented by children.
 *
 * @param {!{
 *   titleId: string,
 *   onClose: function,
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
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
          onClick={props.onClose}
        />
      )}
    </div>
  );
}
