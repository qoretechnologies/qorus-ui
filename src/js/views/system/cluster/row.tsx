// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumn } from '../../../components/ActionColumn';
import ContentByType from '../../../components/ContentByType';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import NameColumn from '../../../components/NameColumn';
import { Td, Tr } from '../../../components/new_table';
import actions from '../../../store/api/actions';

type Props = {
  type: string;
  client_id: string;
  pid: number;
  priv_str: string;
  status_string: string;
  urls: Array<string>;
  link?: string;
  _updated?: boolean;
  updateDone: Function;
  node: string;
  openPane: Function;
  closePane: Function;
  id: string;
  isActive: boolean;
  handleDetailClick: Function;
  interfaceType?: string;
  first?: boolean;
  handleKillClick: Function;
  onKillClick: Function;
};

const typeNames: Object = {
  'qorus-master': 'Qorus node master process controlling process start / stop on each node',
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
  first,
  handleKillClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <Tr highlight={_updated} onHighlightEnd={updateDone} first={first}>
    <Td className="big text">{node}</Td>
    <NameColumn
      link={link}
      name={clientId}
      isActive={isActive}
      onDetailClick={handleDetailClick}
      type={interfaceType}
    />
    <ActionColumn>
      <ButtonGroup>
        <Button icon="cross" btnStyle="danger" title="Kill" onClick={handleKillClick} />
      </ButtonGroup>
    </ActionColumn>
    <Td className="text medium" title={typeNames[type]}>
      {type}
    </Td>
    <Td className="medium">
      <ContentByType content={pid} />
    </Td>
    <Td className="medium"> {privStr} </Td>
    <Td className="big text">{statusString}</Td>
  </Tr>
);

export default compose(
  withHandlers({
    handleDetailClick:
      ({ openPane, closePane, isActive, id }: Props): Function =>
      (): void => {
        if (isActive) {
          closePane();
        } else {
          openPane(id);
        }
      },
    handleKillClick:
      ({ id, onKillClick }: Props): Function =>
      (): void => {
        onKillClick(id);
      },
  }),
  connect(
    null,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
    { updateDone: actions.system.updateDone }
  ),
  pure(['priv_str', 'status_string', 'isActive'])
)(ProcessRow);
