// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import { Control as Button } from '../../../components/controls';
import actions from '../../../store/api/actions';

type Props = {
  selectNone: Function,
  selectedIds: Array<number>,
  action: Function,
  handleEnableClick: Function,
  handleDisableClick: Function,
  handleBatchAction: Function,
  groups: Array<Object>,
};

const ToolbarActions: Function = ({
  handleEnableClick,
  handleDisableClick,
}: Props): ?React.Element<any> => (
  <div
    className="btn-group pull-left"
    id="selection-actions"
  >
    <Button
      label="Enable"
      icon="power-off"
      big
      btnStyle="default"
      onClick={handleEnableClick}
    />
    <Button
      label="Disable"
      icon="ban"
      big
      btnStyle="default"
      onClick={handleDisableClick}
    />
  </div>
);

export default compose(
  connect(
    (state: Object): Object => ({
      groups: state.api.groups.data,
    }),
    {
      action: actions.groups.groupAction,
      selectNone: actions.groups.selectNone,
    }
  ),
  withHandlers({
    handleBatchAction: ({
      selectedIds,
      action,
      selectNone,
      groups,
    }: Props): Function => (
      type: string
    ): void => {
      const selected: Array<string> = selectedIds.reduce((cur, nxt): Array<string> => {
        const group = groups.find((grp: Object) => grp.id === nxt);

        return group ? [...cur, group.name] : cur;
      }, []);

      action(selected, type);
      selectNone();
    },
  }),
  withHandlers({
    handleEnableClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction(true);
    },
    handleDisableClick: ({ handleBatchAction }: Props): Function => (): void => {
      handleBatchAction(false);
    },
  }),
  pure(['selectedIds']),
)(ToolbarActions);
