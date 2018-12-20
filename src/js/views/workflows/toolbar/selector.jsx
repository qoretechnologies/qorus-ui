// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import actions from '../../../store/api/actions';
import Dropdown, { Control, Item } from '../../../components/dropdown';

type Props = {
  selected: string,
  selectAll: Function,
  selectNone: Function,
  selectInvert: Function,
  selectRunning: Function,
  selectStopped: Function,
  selectAlerts: Function,
  selectedCount?: number,
  disabled: boolean,
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
  disabled,
}: Props): React.Element<any> => (
  <Dropdown disabled={disabled}>
    <Control
      icon={
        selected === 'all'
          ? 'selection'
          : selected === 'some'
          ? 'remove'
          : 'circle'
      }
    >
      {selectedCount}
    </Control>
    <Item title="All" onClick={selectAll} />
    <Item title="None" onClick={selectNone} />
    <Item title="Invert" onClick={selectInvert} />
    <Item title="Running" onClick={selectRunning} />
    <Item title="Stopped" onClick={selectStopped} />
    <Item title="With alerts" onClick={selectAlerts} />
  </Dropdown>
);

export default compose(
  connect(
    () => ({}),
    {
      selectAll: actions.workflows.selectAll,
      selectNone: actions.workflows.selectNone,
      selectInvert: actions.workflows.selectInvert,
      selectRunning: actions.workflows.selectRunning,
      selectStopped: actions.workflows.selectStopped,
      selectAlerts: actions.workflows.selectStopped,
    }
  ),
  pure(['selected', 'selectedCount', 'disabled'])
)(ToolbarSelector);
