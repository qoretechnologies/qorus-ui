// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../components/controls';
import actions from '../../../store/api/actions';
import withDispatch from '../../../hocomponents/withDispatch';
import showIf from '../../../hocomponents/show-if-passed';
import Dropdown, { Item, Control } from '../../../components/dropdown';

type Props = {
  selectNone: Function,
  selectedIds: Array<number>,
  dispatchAction: Function,
  handleBatchAction: Function,
  handleEnableClick: Function,
  handleDisableClick: Function,
  handleLoadClick: Function,
  handleUnloadClick: Function,
  handleResetClick: Function,
};

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
  handleLoadClick,
  handleUnloadClick,
  handleResetClick,
// @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
}: Props): ?React.Element<any> => (
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; icon: string; }' is miss... Remove this comment to see the full error message */ }
    <Control icon="cog">With selected</Control>
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="Enable" onClick={handleEnableClick} />
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="Disable" onClick={handleDisableClick} />
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="Load" onClick={handleLoadClick} />
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="Unload" onClick={handleUnloadClick} />
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="Reset" onClick={handleResetClick} />
  </Dropdown>
);

export default compose(
  connect(
    null,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
      selectNone: actions.services.selectNone,
    }
  ),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIf(({ show }) => show),
  withDispatch(),
  withHandlers({
    handleBatchAction: ({
      selectedIds,
      dispatchAction,
      selectNone,
    }: Props): Function => (actionType: string): void => {
      dispatchAction(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
        actions.services.serviceAction,
        actionType,
        selectedIds,
        null
      );
      selectNone();
    },
  }),
  withHandlers({
    handleEnableClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('enable');
    },
    handleDisableClick: ({
      handleBatchAction,
    }: Props): Function => (): void => {
      handleBatchAction('disable');
    },
    handleLoadClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('load');
    },
    handleUnloadClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('unload');
    },
    handleResetClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('reset');
    },
  }),
  pure(['selectedIds'])
)(ToolbarActions);
