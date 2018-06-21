// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import Dropdown, { Item, Control } from '../../../../../components/dropdown';
import Checkbox from '../../../../../components/checkbox';
import { CHECKBOX_STATES } from '../../../../../constants/checkbox';
import actions from '../../../../../store/api/actions';

type Props = {
  selected: string,
  selectAll: Function,
  selectNone: Function,
  selectInvert: Function,
};

const ToolbarSelector: Function = ({
  selected,
  selectAll,
  selectNone,
  selectInvert,
}: Props): React.Element<any> => (
  <Dropdown id="selection">
    <Control>
      <Checkbox
        action={
          selected === 'none' || selected === 'some' ? selectAll : selectNone
        }
        checked={CHECKBOX_STATES[selected]}
      />{' '}
    </Control>
    <Item action={selectAll} title="All" />
    <Item action={selectNone} title="None" />
    <Item action={selectInvert} title="Invert" />
  </Dropdown>
);

export default compose(
  connect(
    () => ({}),
    {
      selectAll: actions.orders.selectAll,
      selectNone: actions.orders.selectNone,
      selectInvert: actions.orders.selectInvert,
    }
  ),
  pure(['selected'])
)(ToolbarSelector);
