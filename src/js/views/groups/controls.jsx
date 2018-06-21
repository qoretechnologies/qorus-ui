// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

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
  <ButtonGroup>
    <Button
      title={enabled ? 'Disable' : 'Enable'}
      iconName="power"
      intent={enabled ? Intent.SUCCESS : Intent.DANGER}
      onClick={handleEnableClick}
      className="pt-small"
    />
  </ButtonGroup>
);

export default compose(
  connect(
    null,
    {
      action: actions.groups.groupAction,
    }
  ),
  withHandlers({
    handleEnableClick: ({
      enabled,
      name,
      action,
    }: Props): Function => (): void => {
      action(name, !enabled);
    },
  }),
  pure(['enabled'])
)(GroupsControls);
