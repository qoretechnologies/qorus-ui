// @flow
import React from 'react';
import compose from 'recompose/compose';
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
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  audits: Array<Object>,
};

const AuditTable: Function = ({ audits, intl }: Props): React.Element<Table> => (
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
      loadMoreCurrent,
      loadMoreTotal,
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
                  currentCount={loadMoreCurrent}
                  total={loadMoreTotal}
                  limit={limit}
                />
                <Search onSearchUpdate={handleSearchChange} resource="audits" />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <IdColumnHeader name="audit_eventid">
              <FormattedMessage id='table.event-id' />
            </IdColumnHeader>
            <NameColumnHeader
              name="event"
              title={intl.formatMessage({ id: 'table.event' })}
            />
            <Th name="audit_event_code" icon="info-sign">
              <FormattedMessage id='table.code' />
            </Th>
            <DescriptionColumnHeader name="source">
              <FormattedMessage id='table.source' />
            </DescriptionColumnHeader>
            <DescriptionColumnHeader name="reason">
              <FormattedMessage id='table.reason' />
            </DescriptionColumnHeader>
            <DescriptionColumnHeader name="info1">
              <FormattedMessage id='table.info' />
            </DescriptionColumnHeader>
            <AuthorColumnHeader name="who">
              <FormattedMessage id='table.who' />
            </AuthorColumnHeader>
            <DateColumnHeader />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable cols={8} condition={collection.length === 0}>
          {props => (
            <Tbody {...props}>
              {collection.map(
                (step: Object, index: number): React.Element<any> => (
                  <Tr key={step.audit_eventid} first={index === 0}>
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

export default compose(
  pure(['audits']),
  injectIntl
)(AuditTable);
