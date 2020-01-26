// @flow
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';
import { Intent, Tag, Icon } from '@blueprintjs/core';
import { Tr, Td } from '../../../components/new_table';
import Text from '../../../components/text';
import actions from '../../../store/api/actions';

import PingModal from './modals/ping';

import withDispatch from '../../../hocomponents/withDispatch';
import NameColumn from '../../../components/NameColumn';
import Tree from '../../../components/tree';
import ContentByType from '../../../components/ContentByType';
import { injectIntl } from 'react-intl';
import RemoteControls from './controls';

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
  openModal,
  closeModal,
  openPane,
  closePane,
  dispatchAction,
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
      <RemoteControls
        enabled={enabled}
        locked={locked}
        canDelete={canDelete}
        canEdit={canEdit}
        remoteType={remoteType}
        debug_data={debug_data}
        isActive={isActive}
        openPane={openPane}
        closePane={closePane}
        dispatchAction={dispatchAction}
        name={name}
      />
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
  withHandlers({
    handleHighlightEnd: ({ name, updateDone }: Props): Function => (): void => {
      updateDone(name);
    },
    handleDetailClick: ({
      name,
      openPane,
      isActive,
      closePane,
    }): Function => (): void => {
      if (isActive) {
        closePane();
      } else {
        openPane(name);
      }
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
