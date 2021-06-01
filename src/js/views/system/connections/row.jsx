// @flow
import { Icon, Intent, Tag } from '@blueprintjs/core';
import classnames from 'classnames';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import ContentByType from '../../../components/ContentByType';
import NameColumn from '../../../components/NameColumn';
import { Td, Tr } from '../../../components/new_table';
import Text from '../../../components/text';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';
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
  connectionid,
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
    <Td className="large">
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
        connid={connectionid}
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
