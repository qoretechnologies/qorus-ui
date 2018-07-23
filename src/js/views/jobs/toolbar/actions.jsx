// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup, Button } from '@blueprintjs/core';

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
};

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
  handleLoadClick,
  handleUnloadClick,
  handleResetClick,
}: Props): ?React.Element<any> => (
  <ButtonGroup>
    <Button text="Enable" icon="power" onClick={handleEnableClick} />
    <Button text="Disable" icon="remove" onClick={handleDisableClick} />
    <Button text="Load" icon="small-tick" onClick={handleLoadClick} />
    <Button text="Unload" icon="cross" onClick={handleUnloadClick} />
    <Button text="Reset" icon="refresh" onClick={handleResetClick} />
  </ButtonGroup>
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
    }: Props): Function => (actionType: string): void => {
      action(actionType, selectedIds);
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
    handleRunClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('run');
    },
    handleResetClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('reset');
    },
  }),
  pure(['selectedIds'])
)(ToolbarActions);
