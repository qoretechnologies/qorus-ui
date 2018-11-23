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
import DetailButton from '../../../components/detail_button';
import Text from '../../../components/text';
import actions from '../../../store/api/actions';
import withModal from '../../../hocomponents/modal';
import PingModal from './modals/ping';
import ConfirmDialog from '../../../components/confirm_dialog';
import withDispatch from '../../../hocomponents/withDispatch';
import { AlertColumn } from '../../../components/AlertColumn';

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
  up?: boolean,
  safe_url?: string,
  url?: string,
  desc?: string,
  options: Object,
  canDelete: boolean,
  first: boolean,
  loopback: boolean,
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
  loopback,
  enabled,
  handleToggleClick,
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
      <Tag intent={up ? Intent.SUCCESS : Intent.DANGER} className="pt-minimal">
        {up ? 'UP' : 'DOWN'}
      </Tag>
    </Td>
    <Td className="narrow">
      <DetailButton onClick={handleDetailClick} active={isActive} />
    </Td>

    <Td className="medium">
      <ButtonGroup>
        {remoteType === 'user' && (
          <Button
            title={enabled ? 'Disable' : 'Enable'}
            iconName="power"
            onClick={handleToggleClick}
            btnStyle={enabled ? 'success' : 'danger'}
          />
        )}
        <Button title="Ping" iconName="exchange" onClick={handlePingClick} />
        <Button
          disabled={!canDelete}
          iconName="cross"
          intent={Intent.DANGER}
          onClick={handleDeleteClick}
        />
      </ButtonGroup>
    </Td>
    <AlertColumn hasAlerts={hasAlerts} onClick={handleDetailClick} />
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
    {remoteType === 'qorus' && (
      <Td className="normal">{loopback && <Icon iconName="small-tick" />}</Td>
    )}
  </Tr>
);

export default compose(
  connect(
    null,
    {
      updateDone: actions.remotes.updateDone,
    }
  ),
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
      dispatchAction,
    }: Props): Function => (): void => {
      dispatchAction(actions.remotes.toggleConnection, name, !enabled);
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
