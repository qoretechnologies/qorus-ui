import { Intent } from '@blueprintjs/core';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import ConfirmDialog from '../../../components/confirm_dialog';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import { WebIDEButton } from '../../../components/WebIDEButton';
import withModal from '../../../hocomponents/modal';
import actions from '../../../store/api/actions';
import PingModal from './modals/ping';

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
}) => (
  <>
    <ButtonGroup>
      <Button
        title={intl.formatMessage({
          id: enabled ? 'button.disable' : 'button.enable',
        })}
        icon="power"
        onClick={handleToggleClick}
        btnStyle={enabled ? 'success' : 'danger'}
        disabled={locked}
      />
      {remoteType === 'datasources' && (
        <Button
          title={intl.formatMessage({ id: 'button.reset' })}
          icon="refresh"
          onClick={handleResetClick}
        />
      )}
      {(remoteType === 'qorus' || remoteType === 'user') && (
        <Button
          title={intl.formatMessage({ id: 'button.toggleDebug' })}
          icon="code"
          btnStyle={debug_data ? 'success' : 'none'}
          onClick={handleDebugClick}
        />
      )}
      <Button
        title={intl.formatMessage({ id: 'button.ping' })}
        icon="exchange"
        onClick={handlePingClick}
      />
    </ButtonGroup>
    <ButtonGroup>
      {!isPane && (
        <Button
          icon="edit"
          title={intl.formatMessage({ id: 'button.edit' })}
          disabled={!(!locked && canEdit)}
          onClick={handleDetailClick}
        />
      )}
      <Button
        title={intl.formatMessage({ id: 'button.delete' })}
        disabled={!(!locked && canDelete)}
        icon="cross"
        intent={Intent.DANGER}
        onClick={handleDeleteClick}
      />
    </ButtonGroup>
    <WebIDEButton type="connection" id={connid} />
  </>
);

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
        const handleConfirm: Function = (): void => {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
          dispatchAction(actions.remotes.deleteConnection, remoteType, name);
          closeModal();
        };

        openModal(
          <ConfirmDialog onClose={closeModal} onConfirm={handleConfirm}>
            Are you sure you want to delete the {remoteType} connection <strong>{name}</strong> ?
          </ConfirmDialog>
        );
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
