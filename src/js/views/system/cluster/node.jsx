// @flow
import React from 'react';
import withState from 'recompose/withState';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import round from 'lodash/round';
import mapProps from 'recompose/mapProps';

import { Table, Thead, Tbody, Tr, Th } from '../../../components/new_table';
import Icon from '../../../components/icon';
import { getProcessObjectLink } from '../../../helpers/system';
import ProcessRow from './row';
import withSort from '../../../hocomponents/sort';
import { sortDefaults } from '../../../constants/sort';

type Props = {
  node: string,
  memory: number,
  expanded: boolean,
  toggleExpand: Function,
  handleExpandClick: Function,
  processes: Array<Object>,
  hostname: string,
  sortData: Object,
  onSortChange: Function,
  openPane: Function,
  closePane: Function,
  paneId: string,
};

const ClusterNode: Function = ({
  node,
  memory,
  expanded,
  hostname,
  handleExpandClick,
  processes,
  sortData,
  onSortChange,
  openPane,
  closePane,
  paneId,
}: Props): React.Element<any> => (
  <div>
    <h4 onClick={handleExpandClick}>
      <Icon icon={`${expanded ? 'minus' : 'plus'}-square-o`} /> {node}
    </h4>
    {expanded && (
      <div>
        <h5> Hostname: {hostname}</h5>
        <p>
          <strong>Node memory:</strong> {round(memory * 0.00000095367432, 2)}{' '}
          MiB | <strong># of processes:</strong> {processes.length}
        </p>
        <Table condensed striped>
          <Thead>
            <Tr sortData={sortData} onSortChange={onSortChange}>
              <Th className="narrow"> Detail </Th>
              <Th className="text" name="node">
                {' '}
                Node{' '}
              </Th>
              <Th className="text medium" name="type">
                {' '}
                Type{' '}
              </Th>
              <Th className="text" name="client_id">
                {' '}
                Client ID{' '}
              </Th>
              <Th className="medium" name="pid">
                {' '}
                PID{' '}
              </Th>
              <Th className="medium" name="priv">
                {' '}
                Memory
              </Th>
              <Th className="text" name="status">
                {' '}
                Status{' '}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {processes.map((process: Object): React.Element<any> => (
              <ProcessRow
                openPane={openPane}
                closePane={closePane}
                isActive={process.id === paneId}
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
  mapProps(({ processes, ...rest }: Props): Props => ({
    hostname: processes[0].host,
    processes,
    ...rest,
  })),
  withHandlers({
    handleExpandClick: ({ toggleExpand }: Props): Function => () => {
      toggleExpand((expanded): boolean => !expanded);
    },
  }),
  withSort(({ node }) => node, 'processes', sortDefaults.nodes),
  pure(['node', 'memory', 'expanded', 'processes'])
)(ClusterNode);
