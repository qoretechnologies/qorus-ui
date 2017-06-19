// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import Dropdown, {
  Item as DropdownItem,
  Control as DropdownControl,
} from '../../../components/dropdown';
import { Control as Button } from '../../../components/controls';
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
}

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
      <div
        className="btn-group pull-left"
        id="selection-actions"
      >
        <Dropdown id="hidden">
          <DropdownControl> With selected: </DropdownControl>
          <DropdownItem
            title="Start"
            icon="rocket"
            action={handleStartClick}
          />
          <DropdownItem
            title="Enable"
            icon="power-off"
            action={handleEnableClick}
          />
          <DropdownItem
            title="Disable"
            icon="ban"
            action={handleDisableClick}
          />
          <DropdownItem
            title="Reset"
            icon="refresh"
            action={handleResetClick}
          />
          <DropdownItem
            title="Stop"
            icon="ban"
            action={handleStopClick}
          />
          <DropdownItem
            title="Set deprecated"
            icon="flag"
            action={handleSetDeprecatedClick}
          />
          <DropdownItem
            title="Unset deprecated"
            icon="flag-o"
            action={handleUnsetDeprecatedClick}
          />
        </Dropdown>
      </div>
    );
  }

  return (
    <div
      className="btn-group pull-left"
      id="selection-actions"
    >
      <Button
        label="Enable"
        icon="power-off"
        big
        btnStyle="default"
        onClick={handleEnableClick}
      />
      <Button
        label="Disable"
        icon="ban"
        big
        btnStyle="default"
        onClick={handleDisableClick}
      />
      <Button
        label="Reset"
        icon="refresh"
        big
        btnStyle="default"
        onClick={handleResetClick}
      />
      <Dropdown id="hidden">
        <DropdownControl />
        <DropdownItem
          title="Start"
          icon="rocket"
          action={handleStartClick}
        />
        <DropdownItem
          title="Stop"
          icon="ban"
          action={handleStopClick}
        />
        <DropdownItem
          title="Set deprecated"
          icon="flag"
          action={handleSetDeprecatedClick}
        />
        <DropdownItem
          title="Unset deprecated"
          icon="flag-o"
          action={handleUnsetDeprecatedClick}
        />
      </Dropdown>
    </div>
  );
};

export default compose(
  connect(
    () => ({}),
    {
      toggleEnabled: actions.workflows.toggleEnabled,
      toggleStart: actions.workflows.toggleStart,
      toggleDeprecated: actions.workflows.toggleDeprecated,
      reset: actions.workflows.reset,
      unselectAll: actions.workflows.unselectAll,
    }
  ),
  pure([
    'show',
    'selectedIds',
    'isTablet',
  ]),
)(ToolbarActions);
