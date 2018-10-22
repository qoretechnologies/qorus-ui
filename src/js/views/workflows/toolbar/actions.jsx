// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import {
  ButtonGroup,
  Button,
  Popover,
  Menu,
  MenuItem,
  Intent,
  Position,
  MenuDivider,
} from '@blueprintjs/core';

import actions from '../../../store/api/actions';
import withDispatch from '../../../hocomponents/withDispatch';
import Dropdown, { Control, Item } from '../../../components/dropdown';

type Props = {
  show: boolean,
  toggleEnabled: Function,
  toggleStart: Function,
  toggleDeprecated: Function,
  unselectAll: Function,
  reset: Function,
  selectedIds: Array<number>,
  isTablet: boolean,
  dispatchAction: Function,
};

const ToolbarActions: Function = ({
  show,
  unselectAll,
  selectedIds,
  dispatchAction,
}: Props): ?React.Element<any> => {
  if (!show) {
    return null;
  }

  const handleEnableClick: Function = () => {
    dispatchAction(actions.workflows.toggleEnabled, selectedIds, true);
    unselectAll();
  };

  const handleDisableClick: Function = () => {
    dispatchAction(actions.workflows.toggleEnabled, selectedIds, false);
    unselectAll();
  };

  const handleResetClick: Function = () => {
    dispatchAction(actions.workflows.reset, selectedIds);
    unselectAll();
  };

  const handleStartClick: Function = () => {
    dispatchAction(actions.workflows.toggleStart, selectedIds, 'start');
    unselectAll();
  };

  const handleStopClick: Function = () => {
    dispatchAction(actions.workflows.toggleStart, selectedIds, 'stop');
    unselectAll();
  };

  const handleSetDeprecatedClick: Function = () => {
    dispatchAction(actions.workflows.toggleDeprecated, selectedIds, true);
    unselectAll();
  };

  const handleUnsetDeprecatedClick: Function = () => {
    dispatchAction(actions.workflows.toggleDeprecated, selectedIds, false);
    unselectAll();
  };

  return (
    <Dropdown>
      <Control icon="cog">With selected</Control>
      <Item title="Start" onClick={handleStartClick} />
      <Item title="Enable" onClick={handleEnableClick} />
      <Item title="Disable" onClick={handleDisableClick} />
      <Item title="Reset" onClick={handleResetClick} />
      <Item title="Stop" onClick={handleStopClick} />
      <Item title="Set deprecated" onClick={handleSetDeprecatedClick} />
      <Item title="Unset deprecated" onClick={handleUnsetDeprecatedClick} />
    </Dropdown>
  );
};

export default compose(
  connect(
    null,
    {
      unselectAll: actions.workflows.unselectAll,
    }
  ),
  withDispatch(),
  pure(['show', 'selectedIds'])
)(ToolbarActions);
