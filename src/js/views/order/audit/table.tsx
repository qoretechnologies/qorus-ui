// @flow
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { AuthorColumn, AuthorColumnHeader } from '../../../components/AuthorColumn';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import { DateColumn, DateColumnHeader } from '../../../components/DateColumn';
import { DescriptionColumn, DescriptionColumnHeader } from '../../../components/DescriptionColumn';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import EnhancedTable from '../../../components/EnhancedTable';
import { IdColumn, IdColumnHeader } from '../../../components/IdColumn';
import LoadMore from '../../../components/LoadMore';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import Pull from '../../../components/Pull';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';

type Props = {
  audits: Array<Object>;
};

// @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
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
              <FormattedMessage id="table.event-id" />
            </IdColumnHeader>
            <NameColumnHeader name="event" title={intl.formatMessage({ id: 'table.event' })} />
            <Th name="audit_event_code" icon="info-sign">
              <FormattedMessage id="table.code" />
            </Th>
            <DescriptionColumnHeader name="source">
              <FormattedMessage id="table.source" />
            </DescriptionColumnHeader>
            <DescriptionColumnHeader name="reason">
              <FormattedMessage id="table.reason" />
            </DescriptionColumnHeader>
            <DescriptionColumnHeader name="info1">
              <FormattedMessage id="table.info" />
            </DescriptionColumnHeader>
            <AuthorColumnHeader name="who">
              <FormattedMessage id="table.who" />
            </AuthorColumnHeader>
            <DateColumnHeader />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable cols={8} condition={collection.length === 0}>
          {(props) => (
            <Tbody {...props}>
              {collection.map(
                // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (step: Object, index: number): React.Element<any> => (
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'audit_eventid' does not exist on type 'O... Remove this comment to see the full error message
                  <Tr key={step.audit_eventid} first={index === 0}>
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'audit_eventid' does not exist on type 'O... Remove this comment to see the full error message */}
                    <IdColumn className="medium">{step.audit_eventid}</IdColumn>
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'event' does not exist on type 'Object'. */}
                    <NameColumn name={step.event} />
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'audit_event_code' does not exist on type... Remove this comment to see the full error message */}
                    <Td className="normal">{step.audit_event_code}</Td>
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'source' does not exist on type 'Object'. */}
                    <DescriptionColumn>{step.source}</DescriptionColumn>
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'reason' does not exist on type 'Object'. */}
                    <DescriptionColumn>{step.reason}</DescriptionColumn>
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'info1' does not exist on type 'Object'. */}
                    <DescriptionColumn>{step.info1}</DescriptionColumn>
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'who' does not exist on type 'Object'. */}
                    <AuthorColumn>{step.who}</AuthorColumn>
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message */}
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

export default compose(pure(['audits']), injectIntl)(AuditTable);
