/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Controls, Control as Button } from '../../components/controls';

import actions from '../../store/api/actions';

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
  <Controls grouped>
    <Button
      title={enabled ? 'Disable' : 'Enable'}
      icon="power-off"
      btnStyle={enabled ? 'success' : 'danger'}
      onClick={handleToggleEnabledClick}
    />
    <Button
      title="Reset"
      icon="refresh"
      btnStyle="warning"
      onClick={handleResetClick}
    />
  </Controls>
);

export default compose(
  connect(
    () => ({}),
    {
      toggleEnabled: actions.workflows.toggleEnabled,
      reset: actions.workflows.reset,
    }
  ),
  withHandlers({
    handleToggleEnabledClick: ({ toggleEnabled, id, enabled }: Props): Function => (): void => {
      toggleEnabled(id, !enabled);
    },
    handleResetClick: ({ reset, id }: Props): Function => (): void => {
      reset(id);
    },
  }),
  pure([
    'enabled',
  ])
)(WorkflowControls);
