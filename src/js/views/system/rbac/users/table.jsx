/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import UsersRow from './row';
import { Table, Tbody, Thead, Tr, Th } from '../../../../components/new_table';
import sort from '../../../../hocomponents/sort';
import check from '../../../../hocomponents/check-no-data';
import { sortDefaults } from '../../../../constants/sort';

type Props = {
  collection: Array<Object>,
  onEditClick: Function,
  canEdit: boolean,
  onDeleteClick: Function,
  onSortChange: Function,
  sortData: Object,
  canDelete: boolean,
}

const UsersTable: Function = (
  { collection,
    onEditClick,
    onDeleteClick,
    canEdit,
    canDelete,
    onSortChange,
    sortData,
  }: Props
): React.Element<Table> => (
  <Table
    consensed
    striped
    fixed
    key={`users_table-${collection.length}`}
  >
    <Thead>
      <Tr {...{ onSortChange, sortData } }>
        <Th className="narrow">Actions</Th>
        <Th className="name" name="name">Name</Th>
        <Th className="text big" name="username">Username</Th>
        <Th className="text">Roles</Th>
      </Tr>
    </Thead>
    <Tbody>
      { collection.map((user: Object, index: number): React.Element<any> => (
        <UsersRow
          key={index}
          model={user}
          canEdit={canEdit}
          canDelete={canDelete}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </Tbody>
  </Table>
);

export default compose(
  check(({ collection }): boolean => collection && collection.length),
  sort('rbacusers', 'collection', sortDefaults.rbacUsers),
  pure(['sortData', 'collection'])
)(UsersTable);
