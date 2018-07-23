// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup, Button } from '@blueprintjs/core';

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
  <ButtonGroup>
    <Button text="Enable" icon="power" onClick={handleEnableClick} />
    <Button text="Disable" icon="remove" onClick={handleDisableClick} />
  </ButtonGroup>
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
    }: Props): Function => (type: string): void => {
      const selected: Array<string> = selectedIds.reduce((cur, nxt): Array<
        string
      > => {
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
    handleDisableClick: ({
      handleBatchAction,
    }: Props): Function => (): void => {
      handleBatchAction(false);
    },
  }),
  pure(['selectedIds'])
)(ToolbarActions);
