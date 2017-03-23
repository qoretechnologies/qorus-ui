// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import { Controls, Control as Button } from '../../components/controls';
import actions from '../../store/api/actions';

type Props = {
  enabled: boolean,
  name: string,
  action: Function,
  handleEnableClick: Function,
};

const GroupsControls: Function = ({
  enabled,
  handleEnableClick,
}: Props): React.Element<any> => (
  <Controls>
    <Button
      title={enabled ? 'Disable' : 'Enable'}
      icon="power-off"
      btnStyle={enabled ? 'success' : 'danger'}
      onClick={handleEnableClick}
    />
  </Controls>
);

export default compose(
  connect(
    null,
    {
      action: actions.groups.groupAction,
    }
  ),
  withHandlers({
    handleEnableClick: ({ enabled, name, action }: Props): Function => (): void => {
      action(name, !enabled);
    },
  }),
  pure(['enabled'])
)(GroupsControls);
