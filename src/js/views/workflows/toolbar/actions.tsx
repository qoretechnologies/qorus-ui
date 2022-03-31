// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';

type Props = {
  show: boolean;
  toggleEnabled: Function;
  toggleStart: Function;
  toggleDeprecated: Function;
  unselectAll: Function;
  reset: Function;
  selectedIds: Array<number>;
  isTablet: boolean;
  dispatchAction: Function;
};

const ToolbarActions: Function = ({
  show,
  unselectAll,
  selectedIds,
  dispatchAction,
}: // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
Props): React.Element<any> => {
  if (!show) {
    return null;
  }

  const handleEnableClick: Function = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    dispatchAction(actions.workflows.toggleEnabled, selectedIds, true);
    unselectAll();
  };

  const handleDisableClick: Function = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    dispatchAction(actions.workflows.toggleEnabled, selectedIds, false);
    unselectAll();
  };

  const handleResetClick: Function = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    dispatchAction(actions.workflows.reset, selectedIds);
    unselectAll();
  };

  const handleStartClick: Function = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    dispatchAction(actions.workflows.toggleStart, selectedIds, 'start');
    unselectAll();
  };

  const handleStopClick: Function = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    dispatchAction(actions.workflows.toggleStart, selectedIds, 'stop');
    unselectAll();
  };

  const handleSetDeprecatedClick: Function = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    dispatchAction(actions.workflows.toggleDeprecated, selectedIds, true);
    unselectAll();
  };

  const handleUnsetDeprecatedClick: Function = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    dispatchAction(actions.workflows.toggleDeprecated, selectedIds, false);
    unselectAll();
  };

  return (
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    <Dropdown>
      {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; icon: string; }' is miss... Remove this comment to see the full error message */}
      <Control icon="cog">With selected</Control>
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item title="Start" onClick={handleStartClick} />
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item title="Enable" onClick={handleEnableClick} />
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item title="Disable" onClick={handleDisableClick} />
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item title="Reset" onClick={handleResetClick} />
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item title="Stop" onClick={handleStopClick} />
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item title="Set deprecated" onClick={handleSetDeprecatedClick} />
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item title="Unset deprecated" onClick={handleUnsetDeprecatedClick} />
    </Dropdown>
  );
};

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    unselectAll: actions.workflows.unselectAll,
  }),
  withDispatch(),
  pure(['show', 'selectedIds'])
)(ToolbarActions);
