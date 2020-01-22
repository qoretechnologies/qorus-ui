// @flow
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';
import { Intent, Tag, Icon } from '@blueprintjs/core';

import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import { Tr, Td } from '../../../components/new_table';
import Text from '../../../components/text';
import actions from '../../../store/api/actions';
import withModal from '../../../hocomponents/modal';
import PingModal from './modals/ping';
import ConfirmDialog from '../../../components/confirm_dialog';
import withDispatch from '../../../hocomponents/withDispatch';
import NameColumn from '../../../components/NameColumn';
import Tree from '../../../components/tree';
import ContentByType from '../../../components/ContentByType';
import { injectIntl } from 'react-intl';

type Props = {
  name: string,
  isActive?: boolean,
  hasAlerts?: boolean,
  _updated?: boolean,
  handleHighlightEnd: Function,
  handleDetailClick: Function,
  handlePingClick: Function,
  handleDeleteClick: Function,
  updateDone: Function,
  type: string,
  remoteType: string,
  openModal: Function,
  closeModal: Function,
  openPane: Function,
  closePane: Function,
  dispatchAction: Function,
  handleToggleClick: Function,
  enabled: boolean,
  up?: boolean,
  safe_url?: string,
  url?: string,
  desc?: string,
  opts: Object,
  canDelete: boolean,
  first: boolean,
  loopback: boolean,
  handleResetClick: Function,
  locked: boolean,
  canEdit: boolean,
};

const ConnectionRow: Function = ({
  isActive,
  hasAlerts,
  _updated,
  handleHighlightEnd,
  handleDetailClick,
  handlePingClick,
  handleDeleteClick,
  up,
  name,
  safe_url: safeUrl,
  url,
  desc,
  remoteType,
  opts,
  canDelete,
  canEdit,
  first,
  loopback,
  enabled,
  handleToggleClick,
  handleResetClick,
  locked,
  intl,
  handleDebugClick,
  debug_data,
}: Props): React.Element<any> => (
  <Tr
    first={first}
    className={classnames({
      'row-alert': hasAlerts,
      'row-active': isActive,
    })}
    highlight={_updated}
    handleHighlightEnd={handleHighlightEnd}
  >
    <Td className={classnames('normal')}>
      <Tag intent={up ? Intent.SUCCESS : Intent.DANGER} className="bp3-minimal">
        {intl.formatMessage({ id: up ? 'table.up' : 'table.down' })}
      </Tag>
    </Td>
    <NameColumn
      name={name}
      isActive={isActive}
      onDetailClick={handleDetailClick}
      hasAlerts={hasAlerts}
    />
    <Td className="big">
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
        <Button
          icon="edit"
          title={intl.formatMessage({ id: 'button.edit' })}
          disabled={!(!locked && canEdit)}
          onClick={handleDetailClick}
        />
        <Button
          title={intl.formatMessage({ id: 'button.delete' })}
          disabled={!(!locked && canDelete)}
          icon="cross"
          intent={Intent.DANGER}
          onClick={handleDeleteClick}
        />
      </ButtonGroup>
    </Td>
    <Td className="text">
      <p title={safeUrl || url}>
        <Link className="resource-link" to={safeUrl || url}>
          {safeUrl || url}
        </Link>
      </p>
    </Td>

    <Td className="text">
      <Text text={desc} />
    </Td>
    <Td className="medium">
      <ContentByType content={locked} />
    </Td>
    <Td className="medium">{loopback && <Icon icon="small-tick" />}</Td>
  </Tr>
);

export default compose(
  connect(null, {
    updateDone: actions.remotes.updateDone,
  }),
  withDispatch(),
  withModal(),
  withHandlers({
    handleHighlightEnd: ({ name, updateDone }: Props): Function => (): void => {
      updateDone(name);
    },
    handleDetailClick: ({
      name,
      openPane,
      isActive,
      closePane,
    }: Props): Function => (): void => {
      if (isActive) {
        closePane();
      } else {
        openPane(name);
      }
    },
    handlePingClick: ({
      name,
      remoteType,
      openModal,
      closeModal,
    }: Props): Function => (): void => {
      openModal(
        <PingModal name={name} onClose={closeModal} type={remoteType} />
      );
    },
    handleToggleClick: ({
      name,
      enabled,
      remoteType,
      dispatchAction,
    }: Props): Function => (): void => {
      dispatchAction(
        actions.remotes.toggleConnection,
        name,
        !enabled,
        remoteType
      );
    },
    handleDeleteClick: ({
      dispatchAction,
      name,
      remoteType,
      openModal,
      closeModal,
    }: Props): Function => (): void => {
      const handleConfirm: Function = (): void => {
        dispatchAction(actions.remotes.deleteConnection, remoteType, name);
        closeModal();
      };

      openModal(
        <ConfirmDialog onClose={closeModal} onConfirm={handleConfirm}>
          Are you sure you want to delete the {remoteType}{' '}
          <strong>{name}</strong> ?
        </ConfirmDialog>
      );
    },
    handleResetClick: ({
      dispatchAction,
      name,
      remoteType,
    }: Props): Function => (): void => {
      dispatchAction(actions.remotes.resetConnection, remoteType, name);
    },
    handleDebugClick: ({
      dispatchAction,
      name,
      debug_data,
      remoteType,
    }: Props): Function => (): void => {
      dispatchAction(
        actions.remotes.toggleDebug,
        name,
        !debug_data,
        remoteType
      );
    },
  }),
  pure([
    'hasAlerts',
    'isActive',
    '_updated',
    'lockec',
    'up',
    'opts',
    'desc',
    'safe_url',
    'url',
  ]),
  injectIntl
)(ConnectionRow);
