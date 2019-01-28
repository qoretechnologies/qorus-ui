// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import Dropdown, { Item, Control } from '../../../components/dropdown';
import actions from '../../../store/api/actions';
import { Controls as ButtonGroup } from '../../../components/controls';
import { CHECKBOX_STATES } from '../../../constants/checkbox';
import Checkbox from '../../../components/checkbox';

type Props = {
  selected: string,
  selectAll: Function,
  selectNone: Function,
  selectInvert: Function,
  selectAlerts: Function,
  selectedCount?: number,
  disabled: boolean,
};

const ToolbarSelector: Function = ({
  selected,
  selectAll,
  selectNone,
  selectAlerts,
  selectInvert,
  selectedCount,
  disabled,
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Dropdown disabled={disabled}>
      <Control>
        <Checkbox checked={CHECKBOX_STATES[selected]} /> {selectedCount || null}
      </Control>
      <Item action={selectAll} title="All" />
      <Item action={selectNone} title="None" />
      <Item action={selectInvert} title="Invert" />
      <Item action={selectAlerts} title="With alerts" />
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  connect(
    () => ({}),
    {
      selectAll: actions.services.selectAll,
      selectNone: actions.services.selectNone,
      selectInvert: actions.services.selectInvert,
      selectAlerts: actions.services.selectAlerts,
    }
  ),
  pure(['selected', 'selectedCount'])
)(ToolbarSelector);
