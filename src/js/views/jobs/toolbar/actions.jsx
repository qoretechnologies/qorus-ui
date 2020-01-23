// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import actions from '../../../store/api/actions';
import withDispatch from '../../../hocomponents/withDispatch';
import showIfPassed from '../../../hocomponents/show-if-passed';
import Dropdown, { Control, Item } from '../../../components/dropdown';

type Props = {
  selectNone: Function,
  selectedIds: Array<number>,
  dispatchAction: Function,
  handleBatchAction: Function,
  handleEnableClick: Function,
  handleDisableClick: Function,
  handleResetClick: Function,
};

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
  handleResetClick,
}: Props): ?React.Element<any> => (
  <Dropdown>
    <Control icon="cog">With selected</Control>
    <Item title="Enable" icon="power" onClick={handleEnableClick} />
    <Item title="Disable" icon="power" onClick={handleDisableClick} />
    <Item title="Reset" icon="refresh" onClick={handleResetClick} />
  </Dropdown>
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
    handleResetClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction('reset');
    },
  }),
  pure(['show'])
)(ToolbarActions);
