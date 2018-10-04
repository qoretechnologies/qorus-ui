/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import {
  ButtonGroup,
  Button,
  Intent,
  Tooltip,
  Position,
} from '@blueprintjs/core';

import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';

type Props = {
  id: number,
  enabled: boolean,
  toggleEnabled: Function,
  reset: Function,
  handleToggleEnabledClick: Function,
  handleResetClick: Function,
};

const WorkflowControls: Function = ({
  enabled,
  handleToggleEnabledClick,
  handleResetClick,
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Button
      iconName="power"
      intent={enabled ? Intent.SUCCESS : Intent.DANGER}
      onClick={handleToggleEnabledClick}
      className="pt-small"
    />
    <Button
      iconName="refresh"
      onClick={handleResetClick}
      className="pt-small"
    />
  </ButtonGroup>
);

export default compose(
  connect(
    () => ({}),
    {
      withDispatchInjected: actions.system.withDispatchInjected,
    }
  ),
  withDispatch(),
  withHandlers({
    handleToggleEnabledClick: ({
      id,
      enabled,
      dispatchAction,
    }: Props): Function => (): void => {
      dispatchAction(actions.workflows.toggleEnabled, id, !enabled);
    },
    handleResetClick: ({ dispatchAction, id }: Props): Function => (): void => {
      dispatchAction(actions.workflows.reset, id);
    },
  }),
  pure(['enabled'])
)(WorkflowControls);
