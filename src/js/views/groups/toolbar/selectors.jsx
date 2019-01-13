// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import Dropdown, { Item, Control } from '../../../components/dropdown';
import actions from '../../../store/api/actions';
import { Controls as ButtonGroup } from '../../../components/controls';

type Props = {
  selected: string,
  selectAll: Function,
  selectNone: Function,
  selectInvert: Function,
  selectedCount: number,
  disabled: boolean,
};

const ToolbarSelector: Function = ({
  selected,
  selectAll,
  selectNone,
  selectInvert,
  selectedCount,
  disabled,
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Dropdown disabled={disabled}>
      <Control
        iconName={
          selected === 'all'
            ? 'selection'
            : selected === 'some'
            ? 'remove'
            : 'circle'
        }
      >
        {selectedCount}
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
