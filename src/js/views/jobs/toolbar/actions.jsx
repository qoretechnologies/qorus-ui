// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import { Control as Button } from '../../../components/controls';
import actions from '../../../store/api/actions';

type Props = {
  selectNone: Function,
  selectedIds: Array<number>,
  action: Function,
  handleBatchAction: Function,
  handleEnableClick: Function,
  handleDisableClick: Function,
  handleLoadClick: Function,
  handleUnloadClick: Function,
  handleResetClick: Function,
}

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
  handleLoadClick,
  handleUnloadClick,
  handleResetClick,
}: Props): ?React.Element<any> => (
  <div
    className="btn-group pull-left"
    id="selection-actions"
  >
    <Button
      label="Enable"
      icon="power-off"
      big
      btnStyle="default"
      onClick={handleEnableClick}
    />
    <Button
      label="Disable"
      icon="ban"
      big
      btnStyle="default"
      onClick={handleDisableClick}
    />
    <Button
      label="Load"
      icon="check"
      big
      btnStyle="default"
      onClick={handleLoadClick}
    />
    <Button
      label="Unload"
      icon="times"
      big
      btnStyle="default"
      onClick={handleUnloadClick}
    />
    <Button
      label="Reset"
      icon="refresh"
      big
      btnStyle="default"
      onClick={handleResetClick}
    />
  </div>
);

export default compose(
  connect(
    () => ({}),
    {
      action: actions.jobs.jobAction,
      selectNone: actions.jobs.selectNone,
    }
  ),
  withHandlers({
    handleBatchAction: ({
      selectedIds,
      action,
      selectNone,
    }: Props): Function => (
      actionType: string
    ): void => {
      action(actionType, selectedIds);
      selectNone();
    },
  }),
  withHandlers({
    handleEnableClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('enable');
    },
    handleDisableClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('disable');
    },
    handleRunClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('run');
    },
    handleResetClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('reset');
    },
  }),
  pure(['selectedIds']),
)(ToolbarActions);
