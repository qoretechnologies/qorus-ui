/* @flow */
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { ReqoreButton } from '@qoretechnologies/reqore';
import { TSizes } from '@qoretechnologies/reqore/dist/constants/sizes';
import { Controls } from '../../components/controls';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';

type Props = {
  id: number;
  enabled: boolean;
  remote: boolean;
  dispatchAction: any;
  handleToggleEnabledClick: () => void;
  handleResetClick: () => void;
  handleRemoteClick: () => void;
  big: boolean;
  size?: TSizes;
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
  size,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Controls marginRight={big ? 3 : 0} stack size={size}>
    <ReqoreButton
      tooltip={intl.formatMessage({ id: enabled ? 'button.disable' : 'button.enable' })}
      icon={enabled ? 'PauseCircleFill' : 'PauseCircleLine'}
      intent={enabled ? 'success' : 'danger'}
      onClick={handleToggleEnabledClick}
    />
    <ReqoreButton
      tooltip={intl.formatMessage({ id: 'button.reset' })}
      icon="RefreshLine"
      onClick={handleResetClick}
    />
    <ReqoreButton
      tooltip={intl.formatMessage({ id: remote ? 'button.set-not-remote' : 'button.set-remote' })}
      icon="GlobeLine"
      intent={remote ? 'info' : undefined}
      onClick={handleRemoteClick}
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
  pure(['enabled', 'remote', 'size']),
  injectIntl
)(WorkflowControls);
