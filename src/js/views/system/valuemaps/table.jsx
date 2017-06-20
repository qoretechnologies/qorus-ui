/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import sort from '../../../hocomponents/sort';
import checkNoData from '../../../hocomponents/check-no-data';
import { sortDefaults } from '../../../constants/sort';
import { Table, Thead, Tbody, Tr, Th } from '../../../components/new_table';
import ValueRow from './row';

type Props = {
  collection: Array<Object>,
  openPane: Function,
  closePane: Function,
  sortData: Object,
  onSortChange: Function,
  isTablet: boolean,
  paneId: number,
}

const ValuemapsTable: Function = ({
  collection,
  openPane,
  closePane,
  sortData,
  onSortChange,
  isTablet,
  paneId,
}: Props): React.Element<any> => console.log(paneId) || (
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
        <Th name="valuetype" className="medium">Type</Th>
        <Th name="mapsize" className="narrow">Size</Th>
        {!isTablet && (
          <Th name="created">Created</Th>
        )}
        {!isTablet && (
          <Th name="modified">Modified</Th>
        )}
        <Th className="narrow">Dump</Th>
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((valuemap: Object): React.Element<any> => (
        <ValueRow
          data={valuemap}
          key={`valuemap_${valuemap.id}`}
          openPane={openPane}
          closePane={closePane}
          isTablet={isTablet}
          isActive={parseInt(paneId, 10) === valuemap.id}
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
  checkNoData(({ collection }) => collection.length),
  pure([
    'collection',
    'sortData',
    'isTablet',
  ])
)(ValuemapsTable);
