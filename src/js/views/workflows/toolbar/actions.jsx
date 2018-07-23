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
  Tooltip,
} from '@blueprintjs/core';

import Dropdown, {
  Item as DropdownItem,
  Control as DropdownControl,
} from '../../../components/dropdown';
import { Control } from '../../../components/controls';
import actions from '../../../store/api/actions';

type Props = {
  show: boolean,
  toggleEnabled: Function,
  toggleStart: Function,
  toggleDeprecated: Function,
  unselectAll: Function,
  reset: Function,
  selectedIds: Array<number>,
  isTablet: boolean,
};

const ToolbarActions: Function = ({
  show,
  toggleEnabled,
  toggleStart,
  toggleDeprecated,
  unselectAll,
  reset,
  selectedIds,
  isTablet,
}: Props): ?React.Element<any> => {
  if (!show) {
    return null;
  }

  const handleEnableClick: Function = () => {
    toggleEnabled(selectedIds, true);
    unselectAll();
  };

  const handleDisableClick: Function = () => {
    toggleEnabled(selectedIds, false);
    unselectAll();
  };

  const handleResetClick: Function = () => {
    reset(selectedIds);
    unselectAll();
  };

  const handleStartClick: Function = () => {
    toggleStart(selectedIds, 'start');
    unselectAll();
  };

  const handleStopClick: Function = () => {
    toggleStart(selectedIds, 'stop');
    unselectAll();
  };

  const handleSetDeprecatedClick: Function = () => {
    toggleDeprecated(selectedIds, true);
    unselectAll();
  };

  const handleUnsetDeprecatedClick: Function = () => {
    toggleDeprecated(selectedIds, false);
    unselectAll();
  };

  if (isTablet) {
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
          <Button icon="caret-down" />
        </Popover>
      </ButtonGroup>
    );
  }

  return (
    <ButtonGroup>
      <Button
        text="Enable"
        icon="power"
        intent={Intent.SUCCESS}
        onClick={handleEnableClick}
      />
      <Button
        text="Disable"
        icon="disable"
        intent={Intent.DANGER}
        onClick={handleDisableClick}
      />
      <Button text="Reset" icon="refresh" onClick={handleResetClick} />
      <Popover
        position={Position.BOTTOM}
        content={
          <Menu>
            <MenuItem
              text="Start"
              icon="airplane"
              onClick={handleStartClick}
              intent={Intent.SUCCESS}
            />
            <MenuItem
              text="Stop"
              icon="disable"
              onClick={handleStopClick}
              intent={Intent.DANGER}
            />
            <MenuItem
              text="Set deprecated"
              icon="flag"
              onClick={handleSetDeprecatedClick}
            />
            <MenuItem
              text="Unset deprecated"
              icon="cross"
              onClick={handleUnsetDeprecatedClick}
            />
          </Menu>
        }
      >
        <Button icon="caret-down" />
      </Popover>
    </ButtonGroup>
  );
};

export default compose(
  connect(() => ({}), {
    toggleEnabled: actions.workflows.toggleEnabled,
    toggleStart: actions.workflows.toggleStart,
    toggleDeprecated: actions.workflows.toggleDeprecated,
    reset: actions.workflows.reset,
    unselectAll: actions.workflows.unselectAll,
  }),
  pure(['show', 'selectedIds', 'isTablet'])
)(ToolbarActions);
