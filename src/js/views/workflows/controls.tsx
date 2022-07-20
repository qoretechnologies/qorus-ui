/* @flow */
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control, Controls } from '../../components/controls';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';

type Props = {
  id: number;
  enabled: boolean;
  remote: boolean;
  dispatchAction: Function;
  handleToggleEnabledClick: Function;
  handleResetClick: Function;
  handleRemoteClick: Function;
  big: boolean;
};

const WorkflowControls: Function = ({
  enabled,
  remote,
  handleToggleEnabledClick,
  handleResetClick,
  handleRemoteClick,
  big,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Controls marginRight={big ? 3 : 0}>
    <Control
      title={intl.formatMessage({ id: enabled ? 'button.disable' : 'button.enable' })}
      icon="power"
      btnStyle={enabled ? 'success' : 'danger'}
      onClick={handleToggleEnabledClick}
      big={big}
    />
    <Control
      big={big}
      title={intl.formatMessage({ id: 'button.reset' })}
      icon="refresh"
      onClick={handleResetClick}
    />
    <Control
      title={intl.formatMessage({ id: remote ? 'button.set-not-remote' : 'button.set-remote' })}
      icon="globe"
      btnStyle={remote ? 'info' : 'default'}
      onClick={handleRemoteClick}
      big={big}
    />
  </Controls>
);

export default compose(
  withDispatch(),
  withHandlers({
    handleToggleEnabledClick:
      ({ id, enabled, dispatchAction }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
        dispatchAction(actions.workflows.toggleEnabled, id, !enabled);
      },
    handleResetClick:
      ({ dispatchAction, id }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
        dispatchAction(actions.workflows.reset, id);
      },
    handleRemoteClick:
      ({ id, remote, dispatchAction }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
        dispatchAction(actions.workflows.setRemote, id, !remote);
      },
  }),
  pure(['enabled', 'remote']),
  injectIntl
)(WorkflowControls);
