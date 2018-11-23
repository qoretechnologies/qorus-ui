// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { Tag } from '@blueprintjs/core';

import { Table, Thead, Tbody, Tr, Th } from '../../../components/new_table';
import { getProcessObjectLink, calculateMemory } from '../../../helpers/system';
import ProcessRow from './row';
import withSort from '../../../hocomponents/sort';
import { sortDefaults } from '../../../constants/sort';
import ExpandableItem from '../../../components/ExpandableItem';
import { NameColumnHeader } from '../../../components/NameColumn';

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
  hostname,
  processes,
  sortData,
  onSortChange,
  openPane,
  closePane,
  paneId,
}: Props): React.Element<any> => (
  <ExpandableItem show title={node}>
    <div className="clear" style={{ padding: '10px 0' }}>
      <Tag className="pt-minimal">Hostname: {hostname}</Tag>{' '}
      <Tag className="pt-minimal">Node memory: {calculateMemory(memory)}</Tag>{' '}
      <Tag className="pt-minimal"># of processes: {processes.length}</Tag>
    </div>
    <Table condensed striped>
      <Thead>
        <Tr sortData={sortData} onSortChange={onSortChange}>
          <Th className="text" name="node">
            Node
          </Th>
          <Th className="text medium" name="type">
            Type
          </Th>
          <NameColumnHeader name="client_id" title="Client ID" />
          <Th className="medium" name="pid">
            PID
          </Th>
          <Th className="medium" name="priv">
            Memory
          </Th>
          <Th className="text" name="status">
            Status
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {processes.map(
          (process: Object): React.Element<any> => (
            <ProcessRow
              openPane={openPane}
              closePane={closePane}
              isActive={process.id === paneId}
              key={process.id}
              {...process}
              link={getProcessObjectLink(process)}
            />
          )
        )}
      </Tbody>
    </Table>
  </ExpandableItem>
);

export default compose(
  mapProps(
    ({ processes, ...rest }: Props): Props => ({
      hostname: processes[0].host,
      processes,
      ...rest,
    })
  ),
  withSort(({ node }) => node, 'processes', sortDefaults.nodes),
  pure(['node', 'memory', 'processes'])
)(ClusterNode);
