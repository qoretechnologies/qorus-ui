// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup, Button } from '@blueprintjs/core';

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
};

const ToolbarActions: Function = ({
  handleRetryClick,
  handleBlockClick,
  handleUnblockClick,
  handleCancelClick,
  handleUncancelClick,
  isTablet,
}: Props): ?React.Element<any> =>
  isTablet ? (
    <ButtonGroup>
      <Dropdown id="hidden">
        <DropdownControl> With selected: </DropdownControl>
        <DropdownItem title="Retry" iconName="refresh" action={handleRetryClick} />
        <DropdownItem
          title="Block"
          iconName="minus-circle"
          action={handleBlockClick}
        />
        <DropdownItem
          title="Unblock"
          iconName="check-circle"
          action={handleUnblockClick}
        />
        <DropdownItem
          title="Cancel"
          iconName="times-circle"
          action={handleCancelClick}
        />
        <DropdownItem
          title="Uncancel"
          iconName="refresh"
          action={handleUncancelClick}
        />
      </Dropdown>
    </ButtonGroup>
  ) : (
    <ButtonGroup>
      <Button text="Retry" iconName="refresh" onClick={handleRetryClick} />
      <Button text="Block" iconName="disable" onClick={handleBlockClick} />
      <Button
        text="Unblock"
        iconName="endorsed"
        big
        btnStyle="default"
        onClick={handleUnblockClick}
      />
      <Button text="Cancel" iconName="remove" onClick={handleCancelClick} />
      <Button
        text="Uncancel"
        iconName="refresh"
        onClick={handleUncancelClick}
      />
    </ButtonGroup>
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
    }: Props): Function => (actionType: string): void => {
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
    handleUnblockClick: ({
      handleBatchAction,
    }: Props): Function => (): void => {
      handleBatchAction('unblock');
    },
    handleCancelClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('cancel');
    },
    handleUncancelClick: ({
      handleBatchAction,
    }: Props): Function => (): void => {
      handleBatchAction('uncancel');
    },
  }),
  pure(['selectedIds', 'isTablet'])
)(ToolbarActions);
