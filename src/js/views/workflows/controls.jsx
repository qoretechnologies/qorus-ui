/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Intent } from '@blueprintjs/core';

import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';
import { Controls, Control } from '../../components/controls';

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
  <Controls>
    <Control
      iconName="power"
      intent={enabled ? Intent.SUCCESS : Intent.DANGER}
      onClick={handleToggleEnabledClick}
      className="pt-small"
    />
    <Control
      iconName="refresh"
      onClick={handleResetClick}
      className="pt-small"
    />
  </Controls>
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
