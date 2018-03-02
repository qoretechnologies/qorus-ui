// @flow
import React from 'react';
import withState from 'recompose/withState';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import round from 'lodash/round';

import { Table, Thead, Tbody, Tr, Th } from '../../../components/new_table';
import Icon from '../../../components/icon';
import { getProcessObjectLink } from '../../../helpers/system';
import ProcessRow from './row';

type Props = {
  node: string,
  memory: number,
  expanded: boolean,
  toggleExpand: Function,
  handleExpandClick: Function,
  processes: Array<Object>,
};

const ClusterNode: Function = ({
  node,
  memory,
  expanded,
  handleExpandClick,
  processes,
}: Props): React.Element<any> => (
  <div>
    <h4 onClick={handleExpandClick}>
      <Icon icon={`${expanded ? 'minus' : 'plus'}-square-o`} /> {node}
    </h4>
    {expanded && (
      <div>
        <p>Memory: {round(memory * 0.00000095367432, 2)} MiB</p>
        <Table condensed striped>
          <Thead>
            <Tr>
              <Th className="text medium"> Type </Th>
              <Th className="text"> Client ID </Th>
              <Th className="medium"> PID </Th>
              <Th className="medium"> Memory</Th>
              <Th className="text"> Status </Th>
              <Th className="text"> Urls </Th>
            </Tr>
          </Thead>
          <Tbody>
            {processes.map((process: Object): React.Element<any> => (
              <ProcessRow
                key={process.id}
                {...process}
                link={getProcessObjectLink(process)}
              />
            ))}
          </Tbody>
        </Table>
      </div>
    )}
  </div>
);

export default compose(
  withState('expanded', 'toggleExpand', true),
  withHandlers({
    handleExpandClick: ({ toggleExpand }: Props): Function => () => {
      toggleExpand((expanded): boolean => !expanded);
    },
  }),
  pure(['node', 'memory', 'expanded', 'processes'])
)(ClusterNode);
