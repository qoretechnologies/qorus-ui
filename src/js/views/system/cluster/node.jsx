// @flow
import React from 'react';
import withState from 'recompose/withState';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import { Tag } from '@blueprintjs/core';

import { Table, Thead, Tbody, Tr, Th } from '../../../components/new_table';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Box from '../../../components/box';
import { getProcessObjectLink, calculateMemory } from '../../../helpers/system';
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
  <Box>
    <Breadcrumbs onClick={handleExpandClick}>
      <Crumb active={expanded} iconName="cross">
        {node}
      </Crumb>
    </Breadcrumbs>

    {expanded && (
      <div>
        <div className="clear" style={{ padding: '10px 0' }}>
          <Tag className="pt-minimal">Hostname: {hostname}</Tag>{' '}
          <Tag className="pt-minimal">
            Node memory: {calculateMemory(memory)}
          </Tag>{' '}
          <Tag className="pt-minimal"># of processes: {processes.length}</Tag>
        </div>
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
      </div>
    )}
  </Box>
);

export default compose(
  withState('expanded', 'toggleExpand', true),
  mapProps(
    ({ processes, ...rest }: Props): Props => ({
      hostname: processes[0].host,
      processes,
      ...rest,
    })
  ),
  withHandlers({
    handleExpandClick: ({ toggleExpand }: Props): Function => () => {
      toggleExpand((expanded): boolean => !expanded);
    },
  }),
  withSort(({ node }) => node, 'processes', sortDefaults.nodes),
  pure(['node', 'memory', 'expanded', 'processes'])
)(ClusterNode);
