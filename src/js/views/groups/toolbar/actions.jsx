// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import actions from '../../../store/api/actions';
import showIfPassed from '../../../hocomponents/show-if-passed';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import withDispatch from '../../../hocomponents/withDispatch';

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
}: Props): ?React.Element<any> => (
  <ButtonGroup>
    <Button
      text="Enable"
      btnStyle="success"
      iconName="power"
      onClick={handleEnableClick}
      big
    />
    <Button
      text="Disable"
      btnStyle="danger"
      iconName="remove"
      onClick={handleDisableClick}
      big
    />
  </ButtonGroup>
);

export default compose(
  showIfPassed(({ show }) => show),
  connect(
    (state: Object): Object => ({
      groups: state.api.groups.data,
    }),
    {
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
        const group = groups.find((grp: Object) => grp.id === nxt);

        return group ? [...cur, group.name] : cur;
      }, []);

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
