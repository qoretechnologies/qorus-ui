// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import showIf from '../../../hocomponents/show-if-passed';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';

type Props = {
  selectNone: Function;
  selectedIds: Array<number>;
  dispatchAction: Function;
  handleBatchAction: Function;
  handleEnableClick: Function;
  handleDisableClick: Function;
  handleLoadClick: Function;
  handleUnloadClick: Function;
  handleResetClick: Function;
};

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
  handleLoadClick,
  handleUnloadClick,
  handleResetClick,
}: // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: string; icon: string; }' is miss... Remove this comment to see the full error message */}
    <Control icon="cog">With selected</Control>
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Enable" onClick={handleEnableClick} />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Disable" onClick={handleDisableClick} />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Load" onClick={handleLoadClick} />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Unload" onClick={handleUnloadClick} />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Reset" onClick={handleResetClick} />
  </Dropdown>
);

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    selectNone: actions.services.selectNone,
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIf(({ show }) => show),
  withDispatch(),
  withHandlers({
    handleBatchAction:
      ({ selectedIds, dispatchAction, selectNone }: Props): Function =>
      (actionType: string): void => {
        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
          actions.services.serviceAction,
          actionType,
          selectedIds,
          null
        );
        selectNone();
      },
  }),
  withHandlers({
    handleEnableClick:
      ({ handleBatchAction }: Props): Function =>
      (): void => {
        handleBatchAction('enable');
      },
    handleDisableClick:
      ({ handleBatchAction }: Props): Function =>
      (): void => {
        handleBatchAction('disable');
      },
    handleLoadClick:
      ({ handleBatchAction }: Props): Function =>
      (): void => {
        handleBatchAction('load');
      },
    handleUnloadClick:
      ({ handleBatchAction }: Props): Function =>
      (): void => {
        handleBatchAction('unload');
      },
    handleResetClick:
      ({ handleBatchAction }: Props): Function =>
      (): void => {
        handleBatchAction('reset');
      },
  }),
  pure(['selectedIds'])
)(ToolbarActions);
