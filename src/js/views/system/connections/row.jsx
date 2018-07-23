// @flow
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';
import { Button, Intent, Tag } from '@blueprintjs/core';

import { Tr, Td } from '../../../components/new_table';
import DetailButton from '../../../components/detail_button';
import Text from '../../../components/text';
import actions from '../../../store/api/actions';
import withModal from '../../../hocomponents/modal';
import PingModal from './modals/ping';
import Badge from '../../../components/badge';
import ConfirmDialog from '../../../components/confirm_dialog';

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
  deleteConnection: Function,
  up?: boolean,
  safe_url?: string,
  url?: string,
  desc?: string,
  options: Object,
  canDelete: boolean,
  first: boolean,
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
  options,
  canDelete,
  first,
}: Props): React.Element<any> => (
  <Tr
    first={first}
    className={classnames({
      'row-active': isActive,
      'row-alert': hasAlerts,
    })}
    highlight={_updated}
    handleHighlightEnd={handleHighlightEnd}
  >
    <Td className={classnames('normal')}>
      <Tag intent={up ? Intent.SUCCESS : Intent.DANGER} className="bp3-minimal">
        {up ? 'UP' : 'DOWN'}
      </Tag>
    </Td>
    <Td className="narrow">
      <DetailButton onClick={handleDetailClick} active={isActive} />
    </Td>
    {canDelete && (
      <Td className="narrow">
        <Button
          icon="cross"
          intent={Intent.DANGER}
          onClick={handleDeleteClick}
          className="bp3-small"
        />
      </Td>
    )}
    <Td className="tiny">
      {hasAlerts && (
        <Button
          icon="warning-sign"
          intent={Intent.DANGER}
          onClick={handleDetailClick}
          className="bp3-small"
        />
      )}
    </Td>
    <Td className="name">
      <Text text={name} />
    </Td>
    {remoteType === 'datasources' ? (
      <Td className="text">
        <Text text={options} renderTree />
      </Td>
    ) : (
      <Td className="text">
        <p title={safeUrl || url}>
          <Link className="resource-link" to={safeUrl || url}>
            {safeUrl || url}
          </Link>
        </p>
      </Td>
    )}
    <Td className="text">
      <Text text={desc} />
    </Td>
    <Td className="normal">
      <Button
        text="Ping"
        icon="exchange"
        onClick={handlePingClick}
        className="bp3-small"
      />
    </Td>
  </Tr>
);

export default compose(
  connect(
    null,
    {
      updateDone: actions.remotes.updateDone,
      deleteConnection: actions.remotes.deleteConnection,
    }
  ),
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
    handleDeleteClick: ({
      deleteConnection,
      name,
      remoteType,
      openModal,
      closeModal,
    }: Props): Function => (): void => {
      const handleConfirm: Function = (): void => {
        deleteConnection(remoteType, name);
        closeModal();
      };

      openModal(
        <ConfirmDialog onClose={closeModal} onConfirm={handleConfirm}>
          Are you sure you want to delete the {remoteType}{' '}
          <strong>{name}</strong> ?
        </ConfirmDialog>
      );
    },
  }),
  pure([
    'hasAlerts',
    'isActive',
    '_updated',
    'up',
    'options',
    'desc',
    'safe_url',
    'url',
  ])
)(ConnectionRow);
