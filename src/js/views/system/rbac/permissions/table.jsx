/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import PermsRow from './row';
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

type Props = {
  collection: Array<Object>,
  onEditClick: Function,
  onDeleteClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  onSortChange: Function,
  sortData: Object,
};

const PermsTable: Function = ({
  collection,
  onSortChange,
  sortData,
  ...rest
}: Props): React.Element<Table> => (
  <Table striped condensed fixed key={`perms_table-${collection.length}`}>
    <Thead>
      <FixedRow {...{ onSortChange, sortData }}>
        <Th className="text normal" name="permission_type">
          Type
        </Th>
        <Th className="name" name="name">
          Name
        </Th>
        <Th className="text" name="desc">
          Description
        </Th>
        <Th className="text narrow"> Actions </Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (role: Object, index: number): React.Element<PermsRow> => (
          <PermsRow first={index === 0} key={index} model={role} {...rest} />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  check(({ collection }): boolean => collection && collection.length),
  sort('rbacperms', 'collection', sortDefaults.rbacPerms),
  pure(['sortData', 'collection'])
)(PermsTable);
