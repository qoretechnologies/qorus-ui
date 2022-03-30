// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import actions from '../../../store/api/actions';
import showIfPassed from '../../../hocomponents/show-if-passed';
import withDispatch from '../../../hocomponents/withDispatch';
import Dropdown, { Control, Item } from '../../../components/dropdown';

type Props = {
  selectNone: Function,
  selectedIds: Array<number>,
  dispatchAction: Function,
  handleEnableClick: Function,
  handleDisableClick: Function,
  handleBatchAction: Function,
  groups: Array<Object>,
  show: boolean,
};

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
// @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
}: Props): ?React.Element<any> => (
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    // @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; icon: string; }' is miss... Remove this comment to see the full error message
    <Control icon="cog">With selected</Control>
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    <Item title="Enable" icon="power" onClick={handleEnableClick} />
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    <Item title="Disable" icon="power" onClick={handleDisableClick} />
  </Dropdown>
);

export default compose(
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ show }) => show),
  connect(
    (state: Object): Object => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      groups: state.api.groups.data,
    }),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
      selectNone: actions.groups.selectNone,
    }
  ),
  withDispatch(),
  withHandlers({
    handleBatchAction: ({
      selectedIds,
      dispatchAction,
      selectNone,
      groups,
    }: Props): Function => (type: string): void => {
      const selected: Array<string> = selectedIds.reduce((cur, nxt): Array<
        string
      > => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        const group = groups.find((grp: Object) => grp.id === nxt);

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        return group ? [...cur, group.name] : cur;
      }, []);

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
      dispatchAction(actions.groups.groupAction, selected, type);
      selectNone();
    },
  }),
  withHandlers({
    handleEnableClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction(true);
    },
    handleDisableClick: ({
      handleBatchAction,
    }: Props): Function => (): void => {
      handleBatchAction(false);
    },
  }),
  pure(['selectedIds'])
)(ToolbarActions);
