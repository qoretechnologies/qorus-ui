/* @flow */
import React from 'react';
import RolesRow from './row';
import Table, { Section, Row, Cell } from '../../../../components/table';
import sort from '../../../../hocomponents/sort';
import { sortDefaults } from '../../../../constants/sort';
import compose from 'recompose/compose';

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
}

const RolesTable: Function = (
  { collection,
    onSortChange,
    sortData,
    ...other,
  }: Props
): React.Element<Table> => (
  <Table className="table table--data table-striped table-condensed">
    <Section type="head">
      <Row>
        <Cell tag="th"> Actions </Cell>
        <Cell
          tag="th"
          name="role"
          {...{ onSortChange, sortData } }
        > Name </Cell>
        <Cell
          tag="th"
          name="provider"
          {...{ onSortChange, sortData } }
        > Provider </Cell>
        <Cell
          tag="th"
          name="desc"
          {...{ onSortChange, sortData } }
        > Description </Cell>
      </Row>
    </Section>
    <Section type="body">
      { collection.map((role, index) => (
        <RolesRow
          key={index}
          model={role}
          {...other}
        />
      ))}
    </Section>
  </Table>
);

export default compose(
  sort('rbacroles', 'collection', sortDefaults.rbacRoles)
)(RolesTable);
