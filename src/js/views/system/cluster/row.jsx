// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import { Tr, Td } from '../../../components/new_table';
import NameColumn from '../../../components/NameColumn';
import actions from '../../../store/api/actions';
import ContentByType from '../../../components/ContentByType';

type Props = {
  type: string,
  client_id: string,
  pid: number,
  priv_str: string,
  status_string: string,
  urls: Array<string>,
  link?: string,
  _updated?: boolean,
  updateDone: Function,
  node: string,
  openPane: Function,
  closePane: Function,
  id: string,
  isActive: boolean,
  handleDetailClick: Function,
  interfaceType?: string,
};

const typeNames: Object = {
  'qorus-master':
    'Qorus node master process controlling process start / stop on each node',
  'qorus-core':
    'Qorus core process providing global integration services to the application cluster',
  qdsp: 'Qorus distributed datasource pool process',
  qwf: 'Qorus distributed workflow process',
  qsvc: 'Qorus distributed service process',
  qjob: 'Qorus distributed job process',
};

const ProcessRow: Function = ({
  type,
  client_id: clientId,
  pid,
  priv_str: privStr,
  status_string: statusString,
  link,
  _updated,
  updateDone,
  node,
  handleDetailClick,
  isActive,
  interfaceType,
}: Props): React.Element<any> => (
  <Tr highlight={_updated} onHighlightEnd={updateDone}>
    <Td className="text">{node}</Td>
    <NameColumn
      link={link}
      name={clientId}
      isActive={isActive}
      onDetailClick={handleDetailClick}
      type={interfaceType}
    />
    <Td className="text medium" title={typeNames[type]}>
      {type}
    </Td>
    <Td className="medium">
      <ContentByType content={pid} />
    </Td>
    <Td className="medium"> {privStr} </Td>
    <Td className="text">
      <ContentByType content={statusString} />
    </Td>
  </Tr>
);

export default compose(
  withHandlers({
    handleDetailClick: ({
      openPane,
      closePane,
      isActive,
      id,
    }: Props): Function => (): void => {
      if (isActive) {
        closePane();
      } else {
        openPane(id);
      }
    },
  }),
  connect(
    null,
    { updateDone: actions.system.updateDone }
  ),
  pure(['priv_str', 'status_string', 'isActive'])
)(ProcessRow);
