/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import sort from '../../../hocomponents/sort';
import checkNoData from '../../../hocomponents/check-no-data';
import { sortDefaults } from '../../../constants/sort';
import {
  Table,
  Thead,
  Tbody,
  FixedRow,
  Th,
} from '../../../components/new_table';
import ValueRow from './row';
import { Icon } from '@blueprintjs/core';
import { NameColumnHeader } from '../../../components/NameColumn';

type Props = {
  collection: Array<Object>,
  openPane: Function,
  closePane: Function,
  sortData: Object,
  onSortChange: Function,
  isTablet: boolean,
  paneId: number,
};

const ValuemapsTable: Function = ({
  collection,
  openPane,
  closePane,
  sortData,
  onSortChange,
  isTablet,
  paneId,
}: Props): React.Element<any> => (
  <Table striped condensed fixed key={collection.length}>
    <Thead>
      <FixedRow {...{ sortData, onSortChange }}>
        <NameColumnHeader />
        <Th name="desc" className="text">
          Description
        </Th>
        <Th name="author" className="text">
          Author
        </Th>
        <Th name="valuetype" className="medium">
          Type
        </Th>
        <Th name="mapsize" className="narrow">
          Size
        </Th>
        {!isTablet && <Th name="created">Created</Th>}
        {!isTablet && <Th name="modified">Modified</Th>}
        <Th className="narrow">Dump</Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (valuemap: Object, index: number): React.Element<any> => (
          <ValueRow
            first={index === 0}
            data={valuemap}
            key={`valuemap_${valuemap.id}`}
            openPane={openPane}
            closePane={closePane}
            isTablet={isTablet}
            isActive={parseInt(paneId, 10) === valuemap.id}
          />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  sort('valuemaps', 'collection', sortDefaults.valuemaps),
  checkNoData(({ collection }) => collection.length),
  pure(['collection', 'sortData', 'isTablet'])
)(ValuemapsTable);
