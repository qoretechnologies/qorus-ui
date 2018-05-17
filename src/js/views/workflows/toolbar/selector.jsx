// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import {
  Popover,
  Button,
  Position,
  Menu,
  MenuItem,
  Intent,
  MenuDivider,
  ButtonGroup,
  Tooltip,
} from '@blueprintjs/core';

import actions from '../../../store/api/actions';

type Props = {
  selected: string,
  selectAll: Function,
  selectNone: Function,
  selectInvert: Function,
  selectRunning: Function,
  selectStopped: Function,
  selectAlerts: Function,
  selectedCount?: number,
};

const ToolbarSelector: Function = ({
  selected,
  selectAll,
  selectNone,
  selectInvert,
  selectRunning,
  selectStopped,
  selectAlerts,
  selectedCount,
}: Props): React.Element<any> => (
  <Tooltip content="Select workflows" position={Position.RIGHT}>
    <ButtonGroup>
      <Button
        intent={Intent.PRIMARY}
        iconName={
          selected === 'all'
            ? 'selection'
            : selected === 'some'
              ? 'remove'
              : 'circle'
        }
        onClick={selectInvert}
        text={selectedCount || ''}
      />
      <Popover
        content={
          <Menu>
            <MenuItem text="All" onClick={selectAll} />
            <MenuItem text="None" onClick={selectNone} />
            <MenuItem text="Invert" onClick={selectInvert} />
            <MenuDivider />
            <MenuItem text="Running" onClick={selectRunning} />
            <MenuItem text="Stopped" onClick={selectStopped} />
            <MenuDivider />
            <MenuItem text="With alerts" onClick={selectAlerts} />
          </Menu>
        }
        position={Position.BOTTOM}
      >
        <Button intent={Intent.PRIMARY} iconName="caret-down" />
      </Popover>
    </ButtonGroup>
  </Tooltip>
);

export default compose(
  connect(() => ({}), {
    selectAll: actions.workflows.selectAll,
    selectNone: actions.workflows.selectNone,
    selectInvert: actions.workflows.selectInvert,
    selectRunning: actions.workflows.selectRunning,
    selectStopped: actions.workflows.selectStopped,
    selectAlerts: actions.workflows.selectStopped,
  }),
  pure(['selected', 'selectedCount'])
)(ToolbarSelector);
