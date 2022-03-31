// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import Dropdown, { Item, Control } from '../../../components/dropdown';
import actions from '../../../store/api/actions';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls as ButtonGroup } from '../../../components/controls';
import { CHECKBOX_STATES } from '../../../constants/checkbox';
import Checkbox from '../../../components/checkbox';

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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <ButtonGroup>
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Dropdown disabled={disabled}>
      { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: (string | number | Element)[]; }... Remove this comment to see the full error message */ }
      <Control>
        <Checkbox checked={CHECKBOX_STATES[selected]} /> {selectedCount || null}
      </Control>
      { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
      <Item action={selectAll} title="All" />
      { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
      <Item action={selectNone} title="None" />
      { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
      <Item action={selectInvert} title="Invert" />
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  connect(
    () => ({}),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
      selectAll: actions.groups.selectAll,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
      selectNone: actions.groups.selectNone,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
      selectInvert: actions.groups.selectInvert,
    }
  ),
  pure(['selected', 'selectedCount'])
)(ToolbarSelector);
