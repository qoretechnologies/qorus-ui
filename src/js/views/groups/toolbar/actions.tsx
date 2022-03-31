// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import showIfPassed from '../../../hocomponents/show-if-passed';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';

type Props = {
  selectNone: Function;
  selectedIds: Array<number>;
  dispatchAction: Function;
  handleEnableClick: Function;
  handleDisableClick: Function;
  handleBatchAction: Function;
  groups: Array<Object>;
  show: boolean;
};

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
}: // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: string; icon: string; }' is miss... Remove this comment to see the full error message */}
    <Control icon="cog">With selected</Control>
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Enable" icon="power" onClick={handleEnableClick} />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Item title="Disable" icon="power" onClick={handleDisableClick} />
  </Dropdown>
);

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ show }) => show),
  connect(
    (state: any): any => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      groups: state.api.groups.data,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
      selectNone: actions.groups.selectNone,
    }
  ),
  withDispatch(),
  withHandlers({
    handleBatchAction:
      ({ selectedIds, dispatchAction, selectNone, groups }: Props): Function =>
      (type: string): void => {
        const selected: Array<string> = selectedIds.reduce((cur, nxt): Array<string> => {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          const group = groups.find((grp: any) => grp.id === nxt);

          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          return group ? [...cur, group.name] : cur;
        }, []);

        // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
        dispatchAction(actions.groups.groupAction, selected, type);
        selectNone();
      },
  }),
  withHandlers({
    handleEnableClick:
      ({ handleBatchAction }: Props): Function =>
      (): void => {
        handleBatchAction(true);
      },
    handleDisableClick:
      ({ handleBatchAction }: Props): Function =>
      (): void => {
        handleBatchAction(false);
      },
  }),
  pure(['selectedIds'])
)(ToolbarActions);
