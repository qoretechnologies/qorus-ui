// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, Intent, ButtonGroup } from '@blueprintjs/core';

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
    <Button text="Enable" icon="power-off" onClick={handleEnableClick} />
    <Button text="Disable" icon="ban" onClick={handleDisableClick} />
    <Button text="Load" icon="check" onClick={handleLoadClick} />
    <Button text="Unload" icon="times" onClick={handleUnloadClick} />
    <Button text="Reset" icon="refresh" onClick={handleResetClick} />
  </ButtonGroup>
);

export default compose(
  connect(
    () => ({}),
    {
      action: actions.services.serviceAction,
      selectNone: actions.services.selectNone,
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
