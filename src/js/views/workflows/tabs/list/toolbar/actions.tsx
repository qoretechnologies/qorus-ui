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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
  selectedIds,
// @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
}: Props): ?React.Element<any> => (
  <ButtonGroup>
    <Dropdown id="hidden">
      { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; icon: string; }' is miss... Remove this comment to see the full error message */ }
      <DropdownControl icon="cog">With selected</DropdownControl>
      <DropdownItem
        title={intl.formatMessage({ id: 'order.retry' })}
        icon="refresh"
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        action={handleRetryClick}
      />
      <DropdownItem
        title={intl.formatMessage({ id: 'order.block' })}
        icon="minus-circle"
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        action={handleBlockClick}
      />
      <DropdownItem
        title={intl.formatMessage({ id: 'order.unblock' })}
        icon="check-circle"
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        action={handleUnblockClick}
      />
      <DropdownItem
        title={intl.formatMessage({ id: 'order.cancel' })}
        icon="times-circle"
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        action={handleCancelClick}
      />
      <DropdownItem
        title={intl.formatMessage({ id: 'order.uncancel' })}
        icon="refresh"
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        action={handleUncancelClick}
      />
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ show }) => show),
  mapProps(({ selectedIds, ...rest }) => ({
    selectedIds,
    idsLength: selectedIds.length,
    ...rest,
  })),
  connect(
    null,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
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
