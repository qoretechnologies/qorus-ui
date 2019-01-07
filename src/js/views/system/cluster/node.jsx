// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { Tag } from '@blueprintjs/core';

import {
  Table,
  Thead,
  Tbody,
  Th,
  FixedRow,
} from '../../../components/new_table';
import {
  getProcessObjectLink,
  calculateMemory,
  getProcessObjectType,
} from '../../../helpers/system';
import ProcessRow from './row';
import ExpandableItem from '../../../components/ExpandableItem';
import { NameColumnHeader } from '../../../components/NameColumn';
import EnhancedTable from '../../../components/EnhancedTable';
import Pull from '../../../components/Pull';
import LoadMore from '../../../components/LoadMore';
import Search from '../../../containers/search';
import { sortDefaults } from '../../../constants/sort';
import { ActionColumnHeader } from '../../../components/ActionColumn';
import withProcessKill from '../../../hocomponents/withProcessKill';

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
  dispatchAction: Function,
  openModal: Function,
  closeModal: Function,
  handleKillClick: Function,
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
  handleKillClick,
}: Props): React.Element<any> => (
  <ExpandableItem show title={node}>
    <EnhancedTable
      tableId={node}
      collection={processes}
      searchBy={['node', 'client_id', 'type', 'pid', 'priv_str', 'status']}
      sortDefault={sortDefaults.nodes}
    >
      {({
        collection,
        handleLoadMore,
        handleLoadAll,
        limit,
        handleSearchChange,
        canLoadMore,
        sortData,
        onSortChange,
      }) => (
        <Table condensed striped fixed>
          <Thead>
            <FixedRow className="toolbar-row">
              <Th>
                <Pull>
                  <Tag className="pt-large pt-minimal">
                    Hostname: {hostname}
                  </Tag>{' '}
                  <Tag className="pt-large pt-minimal">
                    Node memory: {calculateMemory(memory)}
                  </Tag>{' '}
                  <Tag className="pt-large pt-minimal">
                    # of processes: {processes.length}
                  </Tag>
                </Pull>
                <Pull right>
                  <LoadMore
                    onLoadMore={handleLoadMore}
                    onLoadAll={handleLoadAll}
                    limit={limit}
                    canLoadMore={canLoadMore}
                  />
                  <Search
                    onSearchUpdate={handleSearchChange}
                    resource="cluster"
                  />
                </Pull>
              </Th>
            </FixedRow>
            <FixedRow sortData={sortData} onSortChange={onSortChange}>
              <Th className="text" name="node" icon="database">
                Node
              </Th>
              <NameColumnHeader
                name="client_id"
                title="Client ID"
                icon="intersection"
              />
              <ActionColumnHeader />
              <Th className="text medium" name="type" icon="application">
                Type
              </Th>
              <Th className="medium" name="pid">
                PID
              </Th>
              <Th className="medium" name="priv" icon="layers">
                Memory
              </Th>
              <Th className="text" name="status" icon="info-sign">
                Status
              </Th>
            </FixedRow>
          </Thead>
          <Tbody>
            {collection.map(
              (process: Object, index: number): React.Element<any> => (
                <ProcessRow
                  first={index === 0}
                  openPane={openPane}
                  closePane={closePane}
                  isActive={process.id === paneId}
                  key={process.pid}
                  {...process}
                  link={getProcessObjectLink(process)}
                  interfaceType={getProcessObjectType(process)}
                  onKillClick={handleKillClick}
                />
              )
            )}
          </Tbody>
        </Table>
      )}
    </EnhancedTable>
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
  withProcessKill,
  pure(['node', 'memory', 'processes'])
)(ClusterNode);
