// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import size from 'lodash/size';

import {
  Table,
  Thead,
  Tbody,
  Th,
  FixedRow,
} from '../../../../../components/new_table';
import Search from '../../../../../containers/search';
import sync from '../../../../../hocomponents/sync';
import actions from '../../../../../store/api/actions';
import { resourceSelector } from '../../../../../selectors';
import SLARow from './row';
import { NameColumnHeader } from '../../../../../components/NameColumn';
import LoadMore from '../../../../../components/LoadMore';
import EnhancedTable from '../../../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../../../components/EnhancedTable';
import { sortDefaults } from '../../../../../constants/sort';
import { ActionColumnHeader } from '../../../../../components/ActionColumn';
import Pull from '../../../../../components/Pull';
import DataOrEmptyTable from '../../../../../components/DataOrEmptyTable';

type Props = {
  methods: Array<Object>,
  slas: Array<Object>,
  service: Object,
  perms: Array<string>,
  setMethod: Function,
  removeMethod: Function,
};

const MethodsTable: Function = ({
  methods,
  slas,
  service,
  perms,
  setMethod,
  removeMethod,
}: Props): React.Element<any> => (
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
                  limit={limit}
                />
                <Search
                  onSearchUpdate={handleSearchChange}
                  resource="methods"
                />
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
          {props => (
            <Tbody {...props}>
              {collection.map(
                (method: Object, index: number): React.Element<any> => (
                  <SLARow
                    first={index === 0}
                    observeElement={index === 0 && '.pane'}
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
    slas: meta.data,
    perms: user.data.permissions,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.slas.fetch,
    }
  ),
  sync('meta'),
  pure(['methods', 'slas', 'service', 'perms'])
)(MethodsTable);
