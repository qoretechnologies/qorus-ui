// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import actions from '../../../store/api/actions';
import withDispatch from '../../../hocomponents/withDispatch';
import showIfPassed from '../../../hocomponents/show-if-passed';

type Props = {
  selectNone: Function,
  selectedIds: Array<number>,
  dispatchAction: Function,
  handleBatchAction: Function,
  handleEnableClick: Function,
  handleDisableClick: Function,
  handleRunClick: Function,
  handleResetClick: Function,
};

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
  handleRunClick,
  handleResetClick,
}: Props): ?React.Element<any> => (
  <ButtonGroup>
    <Button
      text="Enable"
      iconName="power"
      btnStyle="success"
      onClick={handleEnableClick}
      big
    />
    <Button
      text="Disable"
      btnStyle="danger"
      iconName="remove"
      onClick={handleDisableClick}
      big
    />
    <Button text="Load" iconName="play" onClick={handleRunClick} big />
    <Button text="Reset" iconName="refresh" onClick={handleResetClick} big />
  </ButtonGroup>
);

export default compose(
  showIfPassed(({ show }) => show),
  connect(
    null,
    {
      selectNone: actions.jobs.selectNone,
    }
  ),
  withDispatch(),
  withHandlers({
    handleBatchAction: ({
      selectedIds,
      dispatchAction,
      selectNone,
    }: Props): Function => (actionType: string): void => {
      dispatchAction(actions.jobs.jobsAction, actionType, selectedIds);
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
