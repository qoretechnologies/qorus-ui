import {
  ReqoreButton,
  ReqoreControlGroup,
  ReqoreModal,
  ReqoreSpinner,
  useReqoreProperty,
} from '@qoretechnologies/reqore';
import { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { useAsyncRetry } from 'react-use';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { WebIDEButton } from '../../../components/WebIDEButton';
import withModal from '../../../hocomponents/modal';
import settings from '../../../settings';
import actions from '../../../store/api/actions';
import { get } from '../../../store/api/utils';
import PingModal from './modals/ping';

// Redirect back to the current client
const redirect_uri = window.location.origin + window.location.pathname;

const OAuth2Modal = ({ name, closeModal, ...rest }) => {
  const { loading, value } = useAsyncRetry(async () => {
    const data = await get(
      `${settings.REST_BASE_URL}/connections/${name}/oauth2AuthRequestUri?redirect_uri=${redirect_uri}`
    );

    return data;
  });

  useEffect(() => {
    if (value) {
      window.location.href = value;
    }
  }, [value]);

  return (
    <ReqoreModal {...rest} isOpen intent="info" label={`OAuth2 Access request for ${name}`}>
      {loading && <ReqoreSpinner centered>Loading...</ReqoreSpinner>}
      {value && <ReqoreSpinner centered>Redirecting...</ReqoreSpinner>}
    </ReqoreModal>
  );
};

const RemoteControls = ({
  intl,
  enabled,
  handleToggleClick,
  locked,
  canDelete,
  handleResetClick,
  remoteType,
  debug_data,
  handleDebugClick,
  handlePingClick,
  canEdit,
  handleDetailClick,
  handleDeleteClick,
  isPane,
  connid,
  name,
  features,
  big,
  ...rest
}) => {
  const confirmAction = useReqoreProperty('confirmAction');
  const addModal = useReqoreProperty('addModal');

  console.log(features, rest);

  const handleOauthClick = () => {
    addModal(<OAuth2Modal name={name} />);
  };

  return (
    <ReqoreControlGroup size={big ? undefined : 'small'} fluid={false}>
      <ReqoreControlGroup stack>
        <ReqoreButton
          tooltip={intl.formatMessage({
            id: enabled ? 'button.disable' : 'button.enable',
          })}
          icon="PlayLine"
          onClick={handleToggleClick}
          intent={enabled ? 'success' : 'danger'}
          disabled={locked}
        />
        {remoteType === 'datasources' && (
          <ReqoreButton
            title={intl.formatMessage({ id: 'button.reset' })}
            icon="HistoryLine"
            onClick={handleResetClick}
          />
        )}
        {(remoteType === 'qorus' || remoteType === 'user') && (
          <ReqoreButton
            tooltip={intl.formatMessage({ id: 'button.toggleDebug' })}
            icon="CodeLine"
            intent={debug_data ? 'success' : undefined}
            onClick={handleDebugClick}
          />
        )}
        <ReqoreButton
          tooltip={intl.formatMessage({ id: 'button.ping' })}
          icon="ExchangeLine"
          onClick={handlePingClick}
        />
      </ReqoreControlGroup>
      <ReqoreControlGroup stack>
        {!isPane && (
          <ReqoreButton
            icon="EditLine"
            tooltip={intl.formatMessage({ id: 'button.edit' })}
            disabled={!(!locked && canEdit)}
            onClick={handleDetailClick}
          />
        )}
        <ReqoreButton
          tooltip={intl.formatMessage({ id: 'button.delete' })}
          disabled={!(!locked && canDelete)}
          icon="CloseLine"
          intent="danger"
          onClick={() => {
            confirmAction({
              description: `Are you sure you want to delete the ${remoteType} connection ${name}?`,
              onConfirm: handleDeleteClick,
              intent: 'danger',
            });
          }}
        />
      </ReqoreControlGroup>
      {features?.['oauth2-auth-code'] && (
        <ReqoreButton
          icon="RemoteControlLine"
          tooltip="Grant OAuth2 Access"
          intent="info"
          onClick={handleOauthClick}
        />
      )}
      <WebIDEButton type="connection" id={connid} big={big} />
    </ReqoreControlGroup>
  );
};

export default compose(
  injectIntl,
  withModal(),
  withHandlers({
    handleDetailClick:
      ({ name, openPane, isActive, closePane }): Function =>
      (): void => {
        if (isActive) {
          closePane();
        } else {
          openPane(name);
        }
      },
    handlePingClick:
      ({ name, remoteType, openModal, closeModal }): Function =>
      (): void => {
        openModal(<PingModal name={name} onClose={closeModal} type={remoteType} />);
      },
    handleToggleClick:
      ({ name, enabled, remoteType, dispatchAction }): Function =>
      (): void => {
        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
          actions.remotes.toggleConnection,
          name,
          !enabled,
          remoteType
        );
      },
    handleDeleteClick:
      ({ dispatchAction, name, remoteType, openModal, closeModal }): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
        dispatchAction(actions.remotes.deleteConnection, remoteType, name);
        closeModal();
      },
    handleResetClick:
      ({ dispatchAction, name, remoteType }): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
        dispatchAction(actions.remotes.resetConnection, remoteType, name);
      },
    handleDebugClick:
      ({ dispatchAction, name, debug_data, remoteType }): Function =>
      (): void => {
        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
          actions.remotes.toggleDebug,
          name,
          !debug_data,
          remoteType
        );
      },
  })
)(RemoteControls);
