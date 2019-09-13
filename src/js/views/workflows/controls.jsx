/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';
import { Controls, Control } from '../../components/controls';
import { injectIntl } from 'react-intl';

type Props = {
  id: number,
  enabled: boolean,
  remote: boolean,
  dispatchAction: Function,
  handleToggleEnabledClick: Function,
  handleResetClick: Function,
  handleRemoteClick: Function,
  big: boolean,
};

const WorkflowControls: Function = ({
  enabled,
  remote,
  handleToggleEnabledClick,
  handleResetClick,
  handleRemoteClick,
  big,
  intl,
}: Props): React.Element<any> => (
  <Controls marginRight={big ? 3 : 0}>
    <Control
      title={intl.formatMessage({ id: (enabled ? 'button.disable' : 'button.enable') })}
      iconName="power"
      btnStyle={enabled ? 'success' : 'danger'}
      onClick={handleToggleEnabledClick}
      big={big}
    />
    <Control
      big={big}
      title={intl.formatMessage({ id: 'button.reset' })}
      iconName="refresh"
      onClick={handleResetClick}
    />
    <Control
      title={intl.formatMessage({ id: (remote ? 'button.set-not-remote' : 'button.set-remote') })}
      iconName="globe"
      btnStyle={remote ? 'info' : 'default'}
      onClick={handleRemoteClick}
      big={big}
    />
  </Controls>
);

export default compose(
  withDispatch(),
  withHandlers({
    handleToggleEnabledClick: ({
      id,
      enabled,
      dispatchAction,
    }: Props): Function => (): void => {
      dispatchAction(actions.workflows.toggleEnabled, id, !enabled);
    },
    handleResetClick: ({ dispatchAction, id }: Props): Function => (): void => {
      dispatchAction(actions.workflows.reset, id);
    },
    handleRemoteClick: ({
      id,
      remote,
      dispatchAction,
    }: Props): Function => (): void => {
      dispatchAction(actions.workflows.setRemote, id, !remote);
    },
  }),
  pure(['enabled', 'remote']),
  injectIntl
)(WorkflowControls);
