// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import Dropdown, { Item, Control } from '../../../components/dropdown';
import Checkbox from '../../../components/checkbox';
import { CHECKBOX_STATES } from '../../../constants/checkbox';
import actions from '../../../store/api/actions';
import { ButtonGroup } from '@blueprintjs/core';

type Props = {
  selected: string,
  selectAll: Function,
  selectNone: Function,
  selectInvert: Function,
  selectedCount: number,
};

const ToolbarSelector: Function = ({
  selected,
  selectAll,
  selectNone,
  selectInvert,
  selectedCount,
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Dropdown id="selection" className="pull-left">
      <Control>
        <Checkbox
          action={
            selected === 'none' || selected === 'some' ? selectAll : selectNone
          }
          checked={CHECKBOX_STATES[selected]}
        />
        {selectedCount || ''}
      </Control>
      <Item action={selectAll} title="All" />
      <Item action={selectNone} title="None" />
      <Item action={selectInvert} title="Invert" />
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  connect(
    () => ({}),
    {
      selectAll: actions.groups.selectAll,
      selectNone: actions.groups.selectNone,
      selectInvert: actions.groups.selectInvert,
    }
  ),
  pure(['selected', 'selectedCount'])
)(ToolbarSelector);
