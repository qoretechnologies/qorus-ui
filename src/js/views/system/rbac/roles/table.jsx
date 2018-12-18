/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import RolesRow from './row';
import {
  Table,
  Tbody,
  Thead,
  Th,
  FixedRow,
} from '../../../../components/new_table';
import sort from '../../../../hocomponents/sort';
import loadMore from '../../../../hocomponents/loadMore';
import { sortDefaults } from '../../../../constants/sort';
import Pull from '../../../../components/Pull';
import LoadMore from '../../../../components/LoadMore';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import { Control as Button } from '../../../../components/controls';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { DescriptionColumnHeader } from '../../../../components/DescriptionColumn';
import { ActionColumnHeader } from '../../../../components/ActionColumn';

type Props = {
  collection: Array<Object>,
  onEditClick: Function,
  onDeleteClick: Function,
  onCloneClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  canCreate: boolean,
  onSortChange: Function,
  sortData: Object,
  onAddRoleClick: Function,
  canLoadMore: boolean,
  handleLoadAll: Function,
  handleLoadMore: Function,
  limit: number,
};

const RolesTable: Function = ({
  collection,
  onSortChange,
  sortData,
  onAddRoleClick,
  canLoadMore,
  handleLoadAll,
  handleLoadMore,
  limit,
  ...rest
}: Props): React.Element<Table> => (
  <Table striped condensed fixed>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan="full">
          <Pull>
            <Button
              disabled={!rest.canCreate}
              text="Add role"
              iconName="plus"
              onClick={onAddRoleClick}
              big
            />
          </Pull>
          <Pull right>
            <LoadMore
              canLoadMore={canLoadMore}
              onLoadMore={handleLoadMore}
              onLoadAll={handleLoadAll}
              limit={limit}
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow {...{ onSortChange, sortData }}>
        <NameColumnHeader name="role" />
        <ActionColumnHeader />
        <Th className="text" name="provider" icon="database">
          Provider
        </Th>
        <DescriptionColumnHeader />
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(collection) === 0} cols={4}>
      {props => (
        <Tbody {...props}>
          {collection.map(
            (role: Object, index: number): React.Element<RolesRow> => (
              <RolesRow
                first={index === 0}
                key={index}
                model={role}
                {...rest}
              />
            )
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  loadMore('collection', null, true, 50),
  sort('rbacroles', 'collection', sortDefaults.rbacRoles),
  pure(['collection', 'sortData'])
)(RolesTable);
