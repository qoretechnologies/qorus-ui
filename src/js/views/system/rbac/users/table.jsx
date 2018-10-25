/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import UsersRow from './row';
import {
  Table,
  Tbody,
  Thead,
  FixedRow,
  Th,
} from '../../../../components/new_table';
import sort from '../../../../hocomponents/sort';
import check from '../../../../hocomponents/check-no-data';
import { sortDefaults } from '../../../../constants/sort';
import Pull from '../../../../components/Pull';
import { Control as Button } from '../../../../components/controls';

type Props = {
  collection: Array<Object>,
  onEditClick: Function,
  canEdit: boolean,
  onDeleteClick: Function,
  onSortChange: Function,
  sortData: Object,
  canDelete: boolean,
  onAddUserClick: Function,
  canAdd: boolean,
};

const UsersTable: Function = ({
  collection,
  onEditClick,
  onDeleteClick,
  canEdit,
  canDelete,
  onSortChange,
  sortData,
  onAddUserClick,
  canAdd,
}: Props): React.Element<Table> => (
  <Table consensed striped fixed key={`users_table-${collection.length}`}>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th collspan="full">
          <Pull>
            <Button
              disabled={!canAdd}
              text="Add user"
              iconName="plus"
              onClick={onAddUserClick}
              big
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow {...{ onSortChange, sortData }}>
        <Th className="name" name="name">
          Name
        </Th>
        <Th className="text big" name="username">
          Username
        </Th>
        <Th className="text">Roles</Th>
        <Th className="text narrow">Actions</Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (user: Object, index: number): React.Element<any> => (
          <UsersRow
            first={index === 0}
            key={index}
            model={user}
            canEdit={canEdit}
            canDelete={canDelete}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  check(({ collection }): boolean => collection && collection.length),
  sort('rbacusers', 'collection', sortDefaults.rbacUsers),
  pure(['sortData', 'collection'])
)(UsersTable);
