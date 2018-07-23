// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import { Control as Button } from '../../../../../components/controls';
import actions from '../../../../../store/api/actions';

type Props = {
  unselectAll: Function,
  selectedIds: Array<number>,
  orderAction: Function,
  handleBatchAction: Function,
  handleRetryClick: Function,
  handleBlockClick: Function,
  handleUnblockClick: Function,
  handleCancelClick: Function,
  handleUncancelClick: Function,
}

const ToolbarActions: Function = ({
  handleRetryClick,
  handleBlockClick,
  handleUnblockClick,
  handleCancelClick,
  handleUncancelClick,
}: Props): ?React.Element<any> => (
  <div
    className="btn-group pull-left"
    id="selection-actions"
  >
    <Button
      label="Retry"
      iconName="refresh"
      big
      btnStyle="default"
      onClick={handleRetryClick}
    />
    <Button
      label="Block"
      iconName="minus-circle"
      big
      btnStyle="default"
      onClick={handleBlockClick}
    />
    <Button
      label="Unblock"
      iconName="check-circle"
      big
      btnStyle="default"
      onClick={handleUnblockClick}
    />
    <Button
      label="Cancel"
      iconName="times-circle"
      big
      btnStyle="default"
      onClick={handleCancelClick}
    />
    <Button
      label="Uncancel"
      iconName="refresh"
      big
      btnStyle="default"
      onClick={handleUncancelClick}
    />
  </div>
);

export default compose(
  connect(
    () => ({}),
    {
      orderAction: actions.orders.action,
      unselectAll: actions.orders.unselectAll,
    }
  ),
  withHandlers({
    handleBatchAction: ({
      selectedIds,
      orderAction,
      unselectAll,
    }: Props): Function => (
      actionType: string
    ): void => {
      orderAction(actionType, selectedIds);
      unselectAll();
    },
  }),
  withHandlers({
    handleRetryClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('retry');
    },
    handleBlockClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('block');
    },
    handleUnblockClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('unblock');
    },
    handleCancelClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('cancel');
    },
    handleUncancelClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('uncancel');
    },
  }),
  pure([
    'selectedIds',
  ]),
)(ToolbarActions);
