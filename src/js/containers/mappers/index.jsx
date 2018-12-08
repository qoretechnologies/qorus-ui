/* @flow */
import React from 'react';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../components/new_table';
import withSort from '../../hocomponents/sort';
import { sortDefaults } from '../../constants/sort';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';

const MappersTable = ({
  mappers,
  onSortChange,
  sortData,
}: {
  mappers: Array<Object>,
  sortData: Object,
  onSortChange: Function,
}): React.Element<any> => (
  <Table condensed striped fixed>
    <Thead>
      <FixedRow {...{ onSortChange, sortData }}>
        <Th className="narrow" name="mapperid">
          ID
        </Th>
        <Th className="name" name="name">
          Name
        </Th>
        <Th className="text" name="type">
          Type
        </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={!mappers || mappers.length === 0} cols={3}>
      {props => (
        <Tbody {...props}>
          {mappers.map(
            (item: Object, index: number): React.Element<any> => (
              <Tr
                key={`mapper_${item.mapperid}`}
                first={index === 0}
                observeElement={index === 0 && '.pane'}
              >
                <Td className="narrow">{item.mapperid}</Td>
                <Td className="name">
                  <Link to={`/mappers/${item.mapperid}`}>
                    {item.name} v{item.version}
                  </Link>
                </Td>
                <Td className="text">{item.type}</Td>
              </Tr>
            )
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  withSort('mappers', 'mappers', sortDefaults.mappers),
  pure(['mappers', 'sortData'])
)(MappersTable);
