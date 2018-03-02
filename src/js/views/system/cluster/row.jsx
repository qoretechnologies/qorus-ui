// @flow
import React from 'react';
import { Link } from 'react-router';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { Tr, Td } from '../../../components/new_table';
import Tree from '../../../components/tree';
import actions from '../../../store/api/actions';

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
};

const ProcessRow: Function = ({
  type,
  client_id: clientId,
  pid,
  priv_str: privStr,
  status_string: statusString,
  urls,
  link,
  _updated,
  updateDone,
}: Props): React.Element<any> => (
  <Tr highlight={_updated} onHighlightEnd={updateDone}>
    <Td className="text medium">{type}</Td>
    <Td className="text">
      {link ? <Link to={link}>{clientId}</Link> : clientId}
    </Td>
    <Td className="medium"> {pid} </Td>
    <Td className="medium"> {privStr} </Td>
    <Td className="text"> {statusString} </Td>
    <Td className="text">
      <Tree noControls data={urls} />
    </Td>
  </Tr>
);

export default compose(
  connect(null, { updateDone: actions.system.updateDone }),
  pure(['priv_str', 'status_string'])
)(ProcessRow);
