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

import { Controls, Control } from '../../components/controls';
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
  <ButtonGroup>
    <Tooltip
      content={enabled ? 'Disable workflow' : 'Enable workflow'}
      position={Position.TOP}
      useSmartPositioning
    >
      <Button
        iconName="power"
        intent={enabled ? Intent.SUCCESS : Intent.DANGER}
        onClick={handleToggleEnabledClick}
        className="pt-small"
      />
    </Tooltip>
    <Tooltip
      content="Reset workflow"
      position={Position.TOP}
      useSmartPositioning
    >
      <Button
        iconName="refresh"
        intent={Intent.PRIMARY}
        onClick={handleResetClick}
        className="pt-small"
      />
    </Tooltip>
  </ButtonGroup>
);

export default compose(
  connect(() => ({}), {
    toggleEnabled: actions.workflows.toggleEnabled,
    reset: actions.workflows.reset,
  }),
  withHandlers({
    handleToggleEnabledClick: ({
      toggleEnabled,
      id,
      enabled,
    }: Props): Function => (): void => {
      toggleEnabled(id, !enabled);
    },
    handleResetClick: ({ reset, id }: Props): Function => (): void => {
      reset(id);
    },
  }),
  pure(['enabled'])
)(WorkflowControls);
