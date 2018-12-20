// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../../components/new_table';
import Pull from '../../../components/Pull';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import EnhancedTable from '../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';
import LoadMore from '../../../components/LoadMore';
import Search from '../../../containers/search';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import {
  DescriptionColumnHeader,
  DescriptionColumn,
} from '../../../components/DescriptionColumn';
import { DateColumnHeader, DateColumn } from '../../../components/DateColumn';
import { IdColumnHeader, IdColumn } from '../../../components/IdColumn';
import {
  AuthorColumnHeader,
  AuthorColumn,
} from '../../../components/AuthorColumn';

type Props = {
  audits: Array<Object>,
};

const AuditTable: Function = ({ audits }: Props): React.Element<Table> => (
  <EnhancedTable
    collection={audits}
    tableId="orderErrors"
    searchBy={[
      'audit_event_code',
      'audit_event_id',
      'created',
      'event',
      'info1',
      'reason',
      'source',
      'who',
    ]}
    sortDefault={sortDefaults.audits}
  >
    {({
      handleSearchChange,
      handleLoadAll,
      handleLoadMore,
      limit,
      collection,
      canLoadMore,
      sortData,
      onSortChange,
    }: EnhancedTableProps) => (
      <Table fixed condensed striped>
        <Thead>
          <FixedRow className="toolbar-row">
            <Th>
              <Pull right>
                <LoadMore
                  canLoadMore={canLoadMore}
                  onLoadMore={handleLoadMore}
                  onLoadAll={handleLoadAll}
                  limit={limit}
                />
                <Search
                  onSearchUpdate={handleSearchChange}
                  resource="orderErrors"
                />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <IdColumnHeader name="audit_eventid">Event ID</IdColumnHeader>
            <NameColumnHeader name="event" title="Event" />
            <Th name="audit_event_code" icon="info-sign">
              Code
            </Th>
            <DescriptionColumnHeader name="source">
              Source
            </DescriptionColumnHeader>
            <DescriptionColumnHeader name="reason">
              Reason
            </DescriptionColumnHeader>
            <DescriptionColumnHeader name="info1">Info</DescriptionColumnHeader>
            <AuthorColumnHeader name="who">Who</AuthorColumnHeader>
            <DateColumnHeader />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable cols={8} condition={collection.length === 0}>
          {props => (
            <Tbody {...props}>
              {collection.map(
                (step: Object, index: number): React.Element<any> => (
                  <Tr key={index} first={index === 0}>
                    <IdColumn className="medium">{step.audit_eventid}</IdColumn>
                    <NameColumn name={step.event} />
                    <Td className="normal">{step.audit_event_code}</Td>
                    <DescriptionColumn>{step.source}</DescriptionColumn>
                    <DescriptionColumn>{step.reason}</DescriptionColumn>
                    <DescriptionColumn>{step.info1}</DescriptionColumn>
                    <AuthorColumn>{step.who}</AuthorColumn>
                    <DateColumn>{step.created}</DateColumn>
                  </Tr>
                )
              )}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    )}
  </EnhancedTable>
);

export default pure(['audits'])(AuditTable);
