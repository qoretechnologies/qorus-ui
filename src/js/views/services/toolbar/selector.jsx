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
  selectAlerts: Function,
  selectedCount?: number,
};

const ToolbarSelector: Function = ({
  selected,
  selectAll,
  selectNone,
  selectAlerts,
  selectInvert,
  selectedCount,
}: Props): React.Element<any> => (
  <ButtonGroup marginRight={3}>
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
