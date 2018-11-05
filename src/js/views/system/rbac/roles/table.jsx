/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import RolesRow from './row';
import {
  Table,
  Tbody,
  Thead,
  Th,
  FixedRow,
} from '../../../../components/new_table';
import sort from '../../../../hocomponents/sort';
import check from '../../../../hocomponents/check-no-data';
import { sortDefaults } from '../../../../constants/sort';
import Pull from '../../../../components/Pull';
import { Control as Button } from '../../../../components/controls';

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
};

const RolesTable: Function = ({
  collection,
  onSortChange,
  sortData,
  onAddRoleClick,
  ...rest
}: Props): React.Element<Table> => (
  <Table striped condensed fixed key={`roles_table-${collection.length}`}>
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
        </Th>
      </FixedRow>
      <FixedRow {...{ onSortChange, sortData }}>
        <Th className="name" name="role">
          Name
        </Th>
        <Th className="text" name="provider">
          Provider
        </Th>
        <Th className="text" name="desc">
          Description
        </Th>
        <Th className="text medium">Actions</Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (role: Object, index: number): React.Element<RolesRow> => (
          <RolesRow first={index === 0} key={index} model={role} {...rest} />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  check(({ collection }): boolean => collection && collection.length),
  sort('rbacroles', 'collection', sortDefaults.rbacRoles),
  pure(['collection', 'sortData'])
)(RolesTable);
