/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import sort from '../../../hocomponents/sort';
import checkNoData from '../../../hocomponents/check-no-data';
import { sortDefaults } from '../../../constants/sort';
import { Table, Thead, Tbody, Tr, Th } from '../../../components/new_table';
import ValueRow from './row';

type Props = {
  collection: Array<Object>,
  openPane: Function,
  sortData: Object,
  onSortChange: Function,
}

const ValuemapsTable: Function = ({
  collection,
  openPane,
  sortData,
  onSortChange,
}: Props): React.Element<any> => (
  <Table
    striped
    condensed
    fixed
    key={collection.length}
  >
    <Thead>
      <Tr {...{ sortData, onSortChange }}>
        <Th name="name" className="name">Name</Th>
        <Th className="narrow">Detail</Th>
        <Th name="desc">Description</Th>
        <Th name="author">Author</Th>
        <Th name="valuetype">Type</Th>
        <Th name="mapsize" className="narrow">Size</Th>
        <Th name="created">Created</Th>
        <Th name="modified">Modified</Th>
        <Th>Dump</Th>
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((valuemap: Object): React.Element<any> => (
        <ValueRow
          data={valuemap}
          key={`valuemap_${valuemap.id}`}
          openPane={openPane}
        />
      ))}
    </Tbody>
  </Table>
);

export default compose(
  sort(
    'valuemaps',
    'collection',
    sortDefaults.valuemaps,
  ),
  checkNoData(({ collection }) => collection.length)
)(ValuemapsTable);
