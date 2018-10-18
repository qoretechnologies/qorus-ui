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
  isTablet,
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
    <ButtonGroup>
      <Button text="With selected: " />
      <Popover
        position={Position.BOTTOM}
        content={
          <Menu>
            <MenuItem text="Start" onClick={handleStartClick} />
            <MenuDivider />
            <MenuItem text="Enable" onClick={handleEnableClick} />
            <MenuItem text="Disable" onClick={handleDisableClick} />
            <MenuDivider />
            <MenuItem text="Reset" onClick={handleResetClick} />
            <MenuItem text="Stop" onClick={handleStopClick} />
            <MenuDivider />
            <MenuItem
              text="Set deprecated"
              onClick={handleSetDeprecatedClick}
            />
            <MenuItem
              text="Unset deprecated"
              onClick={handleUnsetDeprecatedClick}
            />
          </Menu>
        }
      >
        <Button iconName="caret-down" />
      </Popover>
    </ButtonGroup>
  );
};

export default compose(
  connect(
    () => ({}),
    {
      unselectAll: actions.workflows.unselectAll,
    }
  ),
  withDispatch(),
  pure(['show', 'selectedIds', 'isTablet'])
)(ToolbarActions);
