// @flow
import size from 'lodash/size';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import type { EnhancedTableProps } from '../../../../components/EnhancedTable';
import EnhancedTable from '../../../../components/EnhancedTable';
import LoadMore from '../../../../components/LoadMore';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../../components/new_table';
import Pull from '../../../../components/Pull';
import { sortDefaults } from '../../../../constants/sort';
import Search from '../../../../containers/search';
import sync from '../../../../hocomponents/sync';
import { resourceSelector } from '../../../../selectors';
import actions from '../../../../store/api/actions';
import SLARow from './row';

type Props = {
  methods: Array<Object>;
  slas: Array<Object>;
  service: Object;
  perms: Array<string>;
  setMethod: Function;
  removeMethod: Function;
};

const MethodsTable: Function = ({
  methods,
  slas,
  service,
  perms,
  setMethod,
  removeMethod,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <EnhancedTable
    collection={methods}
    searchBy={['name']}
    tableId="methods"
    sortDefault={sortDefaults.methods}
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
                  handleLoadMore={handleLoadMore}
                  handleLoadAll={handleLoadAll}
                  currentCount={loadMoreCurrent}
                  total={loadMoreTotal}
                  limit={limit}
                />
                <Search onSearchUpdate={handleSearchChange} resource="methods" />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <NameColumnHeader />
            <ActionColumnHeader />
            <Th name="locktype" icon="lock" />
            <Th name="internal" icon="cog" />
            <Th name="write" icon="edit" />
            <Th icon="time">SLA</Th>
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={size(collection) === 0} cols={6}>
          {(props) => (
            <Tbody {...props}>
              {collection.map(
                // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (method: Object, index: number): React.Element<any> => (
                  <SLARow
                    first={index === 0}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'service_methodid' does not exist on type... Remove this comment to see the full error message
                    key={method.service_methodid}
                    service={service}
                    slas={slas}
                    method={method}
                    perms={perms}
                    setMethod={setMethod}
                    removeMethod={removeMethod}
                  />
                )
              )}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    )}
  </EnhancedTable>
);

const viewSelector: Function = createSelector(
  [resourceSelector('slas'), resourceSelector('currentUser')],
  (meta: Object, user: Object): Object => ({
    meta,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    slas: meta.data,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    perms: user.data.permissions,
  })
);

export default compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
    load: actions.slas.fetch,
  }),
  sync('meta'),
  pure(['methods', 'slas', 'service', 'perms'])
)(MethodsTable);
