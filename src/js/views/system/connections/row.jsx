// @flow
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import { Tr, Td } from '../../../components/new_table';
import { Controls, Control as Button } from '../../../components/controls';
import DetailButton from '../../../components/detail_button';
import Text from '../../../components/text';
import actions from '../../../store/api/actions';
import withModal from '../../../hocomponents/modal';
import PingModal from './modals/ping';
import Badge from '../../../components/badge';

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
}: Props): React.Element<any> => (
  <Tr
    className={classnames({
      info: isActive,
      'row-alert': hasAlerts,
    })}
    highlight={_updated}
    handleHighlightEnd={handleHighlightEnd}
  >
    <Td
      className={
        classnames('normal', up ? 'positive-background' : 'negative-background')
      }
    >
      <Badge val={up ? 'UP' : 'DOWN'} label={up ? 'success' : 'danger'} />
    </Td>
    <Td className="narrow">
      <DetailButton
        onClick={handleDetailClick}
        active={isActive}
      />
    </Td>
    {canDelete && (
      <Td className="narrow">
        <Controls grouped>
          <Button
            icon="times"
            btnStyle="danger"
            onClick={handleDeleteClick}
          />
        </Controls>
      </Td>
    )}
    <Td className="tiny">
      {hasAlerts && (
        <Controls>
          <Button
            title="Show alerts"
            icon="warning"
            btnStyle="danger"
            onClick={handleDetailClick}
          />
        </Controls>
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
        <Text text={safeUrl || url} />
      </Td>
    )}
    <Td className="text">
      <Text text={desc} />
    </Td>
    <Td className="normal">
      <Button
        label="Ping"
        icon="exchange"
        btnStyle="success"
        onClick={handlePingClick}
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
    handleDetailClick: ({ name, openPane, isActive, closePane }: Props): Function => (): void => {
      if (isActive) {
        closePane();
      } else {
        openPane(name);
      }
    },
    handlePingClick: ({ name, remoteType, openModal, closeModal }: Props): Function => (): void => {
      openModal(
        <PingModal
          name={name}
          onClose={closeModal}
          type={remoteType}
        />
      );
    },
    handleDeleteClick: ({ deleteConnection, name, remoteType }: Props): Function => (): void => {
      deleteConnection(remoteType, name);
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
