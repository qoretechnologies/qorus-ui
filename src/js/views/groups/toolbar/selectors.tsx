// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Checkbox from '../../../components/checkbox';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls as ButtonGroup } from '../../../components/controls';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import { CHECKBOX_STATES } from '../../../constants/checkbox';
import actions from '../../../store/api/actions';

type Props = {
  selected: string;
  selectAll: Function;
  selectNone: Function;
  selectInvert: Function;
  selectedCount: number;
  disabled: boolean;
};

const ToolbarSelector: Function = ({
  selected,
  selectAll,
  selectNone,
  selectInvert,
  selectedCount,
  disabled,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ButtonGroup>
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Dropdown disabled={disabled}>
      {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: (string | number | Element)[]; }... Remove this comment to see the full error message */}
      <Control>
        <Checkbox checked={CHECKBOX_STATES[selected]} /> {selectedCount || null}
      </Control>
      {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item action={selectAll} title="All" />
      {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item action={selectNone} title="None" />
      {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item action={selectInvert} title="Invert" />
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  connect(() => ({}), {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
    selectAll: actions.groups.selectAll,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
    selectNone: actions.groups.selectNone,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
    selectInvert: actions.groups.selectInvert,
  }),
  pure(['selected', 'selectedCount'])
)(ToolbarSelector);
