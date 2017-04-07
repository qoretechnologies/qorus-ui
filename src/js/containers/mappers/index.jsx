/* @flow */
import React from 'react';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import { Table, Tbody, Thead, Tr, Th, Td } from '../../components/new_table';
import checkNoData from '../../hocomponents/check-no-data';
import withSort from '../../hocomponents/sort';
import { sortDefaults } from '../../constants/sort';

const MappersTable = ({
  mappers,
  onSortChange,
  sortData,
}: {
  mappers: Array<Object>,
  sortData: Object,
  onSortChange: Function,
}): React.Element<any> => (
  <Table condensed striped>
    <Thead>
      <Tr {...{ onSortChange, sortData }}>
        <Th className="narrow" name="mapperid">ID</Th>
        <Th className="name" name="name">Name</Th>
        <Th className="narrow" name="version">Version</Th>
        <Th classname="text" name="type">Type</Th>
      </Tr>
    </Thead>
    <Tbody>
      {mappers.map((item: Object): React.Element<any> => (
        <Tr key={`mapper_${item.mapperid}`}>
          <Td className="narrow">{item.mapperid}</Td>
          <Td className="name">
            <Link to={`/mappers/${item.mapperid}`}>{item.name}</Link>
          </Td>
          <Td className="narrow">{item.version}</Td>
          <Td className="text">{item.type}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export default compose(
  checkNoData(
    ({ mappers }: { mappers?: Array<Object> }) => (mappers && mappers.length > 0)
  ),
  withSort('mappers', 'mappers', sortDefaults.mappers),
  pure(['mappers', 'sortData'])
)(MappersTable);
