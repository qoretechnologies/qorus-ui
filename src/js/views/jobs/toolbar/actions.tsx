// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import showIfPassed from '../../../hocomponents/show-if-passed';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';

type Props = {
  selectNone: Function;
  selectedIds: Array<number>;
  dispatchAction: Function;
  handleBatchAction: Function;
  handleEnableClick: Function;
  handleDisableClick: Function;
  handleResetClick: Function;
};

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
  handleResetClick,
}: // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: string; icon: string; }' is miss... Remove this comment to see the full error message */}
    <Control icon="cog">With selected</Control>
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Enable" icon="power" onClick={handleEnableClick} />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Disable" icon="power" onClick={handleDisableClick} />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Reset" icon="refresh" onClick={handleResetClick} />
  </Dropdown>
);

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ show }) => show),
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    selectNone: actions.jobs.selectNone,
  }),
  withDispatch(),
  withHandlers({
    handleBatchAction:
      ({ selectedIds, dispatchAction, selectNone }: Props): Function =>
      (actionType: string): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
        dispatchAction(actions.jobs.jobsAction, actionType, selectedIds);
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
    handleResetClick:
      ({ handleBatchAction }: Props): Function =>
      (): void => {
        handleBatchAction('reset');
      },
  }),
  pure(['show'])
)(ToolbarActions);
