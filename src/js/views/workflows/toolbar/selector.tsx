// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import actions from '../../../store/api/actions';
import Dropdown, { Control, Item, Divider } from '../../../components/dropdown';
import Checkbox from '../../../components/checkbox';
import { CHECKBOX_STATES } from '../../../constants/checkbox';

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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown disabled={disabled}>
    { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: (string | number | Element)[]; }... Remove this comment to see the full error message */ }
    <Control>
      <Checkbox checked={CHECKBOX_STATES[selected]} /> {selectedCount || null}
    </Control>
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="All" onClick={selectAll} />
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="None" onClick={selectNone} />
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="Invert" onClick={selectInvert} />
    <Divider />
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="Running" onClick={selectRunning} />
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="Stopped" onClick={selectStopped} />
    <Divider />
    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
    <Item title="With alerts" onClick={selectAlerts} />
  </Dropdown>
);

export default compose(
  connect(
    () => ({}),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      selectAll: actions.workflows.selectAll,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      selectNone: actions.workflows.selectNone,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      selectInvert: actions.workflows.selectInvert,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      selectRunning: actions.workflows.selectRunning,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      selectStopped: actions.workflows.selectStopped,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      selectAlerts: actions.workflows.selectStopped,
    }
  ),
  pure(['selected', 'selectedCount', 'disabled'])
)(ToolbarSelector);
