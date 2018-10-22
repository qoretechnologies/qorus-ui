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
import showIf from '../../../hocomponents/show-if-passed';

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
}: Props): ?React.Element<any> => (
  <ButtonGroup marginRight={3}>
    <Button
      text="Enable"
      btnStyle="success"
      iconName="power"
      onClick={handleEnableClick}
      big
    />
    <Button
      text="Disable"
      btnStyle="danger"
      iconName="power"
      onClick={handleDisableClick}
      big
    />
    <Button big text="Load" iconName="small-tick" onClick={handleLoadClick} />
    <Button big text="Unload" iconName="cross" onClick={handleUnloadClick} />
    <Button big text="Reset" iconName="refresh" onClick={handleResetClick} />
  </ButtonGroup>
);

export default compose(
  connect(
    null,
    {
      selectNone: actions.services.selectNone,
    }
  ),
  showIf(({ show }) => show),
  withDispatch(),
  withHandlers({
    handleBatchAction: ({
      selectedIds,
      dispatchAction,
      selectNone,
    }: Props): Function => (actionType: string): void => {
      dispatchAction(
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
