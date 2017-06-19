// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import { Control as Button } from '../../../../../components/controls';
import actions from '../../../../../store/api/actions';
import Dropdown, {
  Item as DropdownItem,
  Control as DropdownControl,
} from '../../../../../components/dropdown';

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
  isTablet: boolean,
}

const ToolbarActions: Function = ({
  handleRetryClick,
  handleBlockClick,
  handleUnblockClick,
  handleCancelClick,
  handleUncancelClick,
  isTablet,
}: Props): ?React.Element<any> => (
  isTablet ?
    <div
      className="btn-group pull-left"
      id="selection-actions"
    >
      <Dropdown id="hidden">
        <DropdownControl> With selected: </DropdownControl>
        <DropdownItem
          title="Retry"
          icon="refresh"
          action={handleRetryClick}
        />
        <DropdownItem
          title="Block"
          icon="minus-circle"
          action={handleBlockClick}
        />
        <DropdownItem
          title="Unblock"
          icon="check-circle"
          action={handleUnblockClick}
        />
        <DropdownItem
          title="Cancel"
          icon="times-circle"
          action={handleCancelClick}
        />
        <DropdownItem
          title="Uncancel"
          icon="refresh"
          action={handleUncancelClick}
        />
      </Dropdown>
    </div> :
    <div
      className="btn-group pull-left"
      id="selection-actions"
    >
      <Button
        label="Retry"
        icon="refresh"
        big
        btnStyle="default"
        onClick={handleRetryClick}
      />
      <Button
        label="Block"
        icon="minus-circle"
        big
        btnStyle="default"
        onClick={handleBlockClick}
      />
      <Button
        label="Unblock"
        icon="check-circle"
        big
        btnStyle="default"
        onClick={handleUnblockClick}
      />
      <Button
        label="Cancel"
        icon="times-circle"
        big
        btnStyle="default"
        onClick={handleCancelClick}
      />
      <Button
        label="Uncancel"
        icon="refresh"
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
    'isTablet',
  ]),
)(ToolbarActions);
