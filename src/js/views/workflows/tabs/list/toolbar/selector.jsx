// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import Dropdown, { Item, Control } from '../../../../../components/dropdown';
import actions from '../../../../../store/api/actions';

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
  <Dropdown id="selection">
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
    <Item action={selectAll} title="All" />
    <Item action={selectNone} title="None" />
    <Item action={selectInvert} title="Invert" />
  </Dropdown>
);

export default compose(
  connect(
    null,
    {
      selectAll: actions.orders.selectAll,
      selectNone: actions.orders.selectNone,
      selectInvert: actions.orders.selectInvert,
    }
  ),
  pure(['selected', 'selectedCount'])
)(ToolbarSelector);