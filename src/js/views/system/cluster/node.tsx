// @flow
import React from 'react';

import {
  FormattedMessage,
  injectIntl
} from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';

import { Tag } from '@blueprintjs/core';

import { ActionColumnHeader } from '../../../components/ActionColumn';
import EnhancedTable from '../../../components/EnhancedTable';
import ExpandableItem from '../../../components/ExpandableItem';
import LoadMore from '../../../components/LoadMore';
import { NameColumnHeader } from '../../../components/NameColumn';
import {
  FixedRow,
  Table,
  Tbody,
  Th,
  Thead
} from '../../../components/new_table';
import Pull from '../../../components/Pull';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';
import {
  calculateMemory,
  getProcessObjectLink,
  getProcessObjectType
} from '../../../helpers/system';
import withProcessKill from '../../../hocomponents/withProcessKill';
import ProcessRow from './row';

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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
        loadMoreCurrent,
        loadMoreTotal,
        canLoadMore,
        sortData,
        onSortChange,
      }) => (
        <Table condensed striped fixed>
          <Thead>
            <FixedRow className="toolbar-row">
              <Th>
                <Pull>
                  <Tag className="bp3-large bp3-minimal">
                    <FormattedMessage id="cluster.hostname" />: {hostname}
                  </Tag>{' '}
                  <Tag className="bp3-large bp3-minimal">
                    <FormattedMessage id="cluster.node-memory" />:{' '}
                    {calculateMemory(memory)}
                  </Tag>{' '}
                  <Tag className="bp3-large bp3-minimal">
                    <FormattedMessage id="cluster.count-of-processes" />:{' '}
                    {processes.length}
                  </Tag>
                </Pull>
                <Pull right>
                  <LoadMore
                    onLoadMore={handleLoadMore}
                    onLoadAll={handleLoadAll}
                    limit={limit}
                    currentCount={loadMoreCurrent}
                    total={loadMoreTotal}
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
                <FormattedMessage id="cluster.node" />
              </Th>
              <NameColumnHeader
                name="client_id"
                title={intl.formatMessage({ id: 'cluster.client-id' })}
                icon="intersection"
              />
              <ActionColumnHeader />
              <Th className="text medium" name="type" icon="application">
                <FormattedMessage id="table.type" />
              </Th>
              <Th className="medium" name="pid">
                <FormattedMessage id="cluster.pid" />
              </Th>
              <Th className="medium" name="priv" icon="layers">
                <FormattedMessage id="cluster.memory" />
              </Th>
              <Th className="text" name="status" icon="info-sign">
                <FormattedMessage id="table.status" />
              </Th>
            </FixedRow>
          </Thead>
          <Tbody>
            {collection.map(
              // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
              (process: Object, index: number): React.Element<any> => (
                <ProcessRow
                  first={index === 0}
                  openPane={openPane}
                  closePane={closePane}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                  isActive={process.id === paneId}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'pid' does not exist on type 'Object'.
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
  mapProps(({ processes, ...rest }: Props): Props => ({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'host' does not exist on type 'Object'.
    hostname: processes[0]?.host,
    processes,
    ...rest,
  })),
  withProcessKill,
  pure(['node', 'memory', 'processes']),
  injectIntl
)(ClusterNode);
