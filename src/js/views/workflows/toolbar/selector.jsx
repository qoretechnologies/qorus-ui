// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import Dropdown, { Item, Control } from '../../../components/dropdown';
import Checkbox from '../../../components/checkbox';
import { CHECKBOX_STATES } from '../../../constants/checkbox';
import actions from '../../../store/api/actions';

type Props = {
  selected: string,
  selectAll: Function,
  selectNone: Function,
  selectInvert: Function,
  selectRunning: Function,
  selectStopped: Function,
};

const ToolbarSelector: Function = ({
  selected,
  selectAll,
  selectNone,
  selectInvert,
  selectRunning,
  selectStopped,
}: Props): React.Element<any> => (
  <Dropdown
    id="selection"
    className="pull-left"
  >
    <Control>
      <Checkbox
        action={selected === 'none' || selected === 'some' ? selectAll : selectNone}
        checked={CHECKBOX_STATES[selected]}
      />
      {' '}
    </Control>
    <Item
      action={selectAll}
      title="All"
    />
    <Item
      action={selectNone}
      title="None"
    />
    <Item
      action={selectInvert}
      title="Invert"
    />
    <Item
      action={selectRunning}
      title="Running"
    />
    <Item
      action={selectStopped}
      title="Stopped"
    />
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
    }
  ),
  pure(['selected'])
)(ToolbarSelector);
