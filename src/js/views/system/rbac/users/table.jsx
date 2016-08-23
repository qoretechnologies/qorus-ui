/* @flow */
import React from 'react';

import UsersRow from './row';
import Table, { Section, Row, Cell } from '../../../../components/table';
import sort from '../../../../hocomponents/sort';
import { sortDefaults } from '../../../../constants/sort';
import compose from 'recompose/compose';

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
  <Table className="table table--data table-striped table-condensed">
    <Section type="head">
      <Row>
        <Cell tag="th">Actions</Cell>
        <Cell
          tag="th"
          name="name"
          {...{ onSortChange, sortData } }
        > Name </Cell>
        <Cell
          tag="th"
          name="username"
          {...{ onSortChange, sortData } }
        > Username </Cell>
        <Cell tag="th"> Roles </Cell>
      </Row>
    </Section>
    <Section type="body">
      { collection.map((user, index) => (
        <UsersRow
          key={index}
          model={user}
          canEdit={canEdit}
          canDelete={canDelete}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </Section>
  </Table>
);

export default compose(
  sort('rbacusers', 'collection', sortDefaults.rbacUsers)
)(UsersTable);
