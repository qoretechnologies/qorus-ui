/* @flow */
import React from 'react';
import PermsRow from './row';
import Table, { Section, Row, Cell } from '../../../../components/table';
import sort from '../../../../hocomponents/sort';
import { sortDefaults } from '../../../../constants/sort';
import compose from 'recompose/compose';

type Props = {
  collection: Array<Object>,
  onEditClick: Function,
  onDeleteClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  onSortChange: Function,
  sortData: Object,
}

const PermsTable: Function = (
  { collection,
    onSortChange,
    sortData,
    ...other
  }: Props
): React.Element<Table> => (
  <Table className="table table--data table-striped table-condensed">
    <Section type="head">
      <Row>
        <Cell tag="th"> Actions </Cell>
        <Cell
          tag="th"
          name="permission_type"
          {...{ onSortChange, sortData } }
        > Type </Cell>
        <Cell
          tag="th"
          name="name"
          {...{ onSortChange, sortData } }
        > Name </Cell>
        <Cell
          tag="th"
          name="desc"
          {...{ onSortChange, sortData } }
        > Description </Cell>
      </Row>
    </Section>
    <Section type="body">
      { collection.map((role, index) => (
        <PermsRow
          key={index}
          model={role}
          {...other}
        />
      ))}
    </Section>
  </Table>
);

export default compose(
  sort('rbacperms', 'collection', sortDefaults.rbacPerms)
)(PermsTable);
