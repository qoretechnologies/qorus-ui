// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import actions from '../../../../../store/api/actions';
import Dropdown, {
  Item as DropdownItem,
  Control as DropdownControl,
} from '../../../../../components/dropdown';
import { Controls as ButtonGroup } from '../../../../../components/controls';
import showIfPassed from '../../../../../hocomponents/show-if-passed';
import withDispatch from '../../../../../hocomponents/withDispatch';
import { injectIntl } from 'react-intl';

type Props = {
  unselectAll: Function,
  selectedIds: Array<number>,
  optimisticDispatch: Function,
  handleBatchAction: Function,
  handleRetryClick: Function,
  handleBlockClick: Function,
  handleUnblockClick: Function,
  handleCancelClick: Function,
  handleUncancelClick: Function,
  isTablet: boolean,
  show: boolean,
};

const ToolbarActions: Function = ({
  handleRetryClick,
  handleBlockClick,
  handleUnblockClick,
  handleCancelClick,
  handleUncancelClick,
  intl,
  selectedIds,
}: Props): ?React.Element<any> => (
  <ButtonGroup>
    <Dropdown id="hidden">
      <DropdownControl icon="cog">With selected</DropdownControl>
      <DropdownItem
        title={intl.formatMessage({ id: 'order.retry' })}
        icon="refresh"
        action={handleRetryClick}
      />
      <DropdownItem
        title={intl.formatMessage({ id: 'order.block' })}
        icon="minus-circle"
        action={handleBlockClick}
      />
      <DropdownItem
        title={intl.formatMessage({ id: 'order.unblock' })}
        icon="check-circle"
        action={handleUnblockClick}
      />
      <DropdownItem
        title={intl.formatMessage({ id: 'order.cancel' })}
        icon="times-circle"
        action={handleCancelClick}
      />
      <DropdownItem
        title={intl.formatMessage({ id: 'order.uncancel' })}
        icon="refresh"
        action={handleUncancelClick}
      />
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  showIfPassed(({ show }) => show),
  mapProps(({ selectedIds, ...rest }) => ({
    selectedIds,
    idsLength: selectedIds.length,
    ...rest,
  })),
  connect(
    null,
    {
      unselectAll: actions.orders.unselectAll,
    }
  ),
  withDispatch(),
  withHandlers({
    handleBatchAction: ({
      selectedIds,
      optimisticDispatch,
      unselectAll,
    }: Props): Function => (actionType: string): void => {
      optimisticDispatch(actions.orders.action, actionType, selectedIds);
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
  pure(['idsLength']),
  injectIntl
)(ToolbarActions);
