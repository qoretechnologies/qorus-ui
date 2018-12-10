/* @flow */
import React from 'react';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../components/new_table';
import AutoComponent from '../components/autocomponent';
import withSort from '../hocomponents/sort';
import { sortDefaults } from '../constants/sort';
import DataOrEmptyTable from '../components/DataOrEmptyTable';

const MappersTable = ({
  vmaps,
  sortData,
  onSortChange,
}: {
  vmaps: Array<Object>,
  sortData: Object,
  onSortChange: Function,
}) => (
  <Table fixed condensed striped>
    <Thead>
      <FixedRow {...{ onSortChange, sortData }}>
        <Th className="narrow" name="id">
          ID
        </Th>
        <Th className="narrow" name="mapsize">
          Mapsize
        </Th>
        <Th className="name" name="name">
          Name
        </Th>
        <Th classname="narrow" name="throws_exception">
          Throws
        </Th>
        <Th className="narrow" name="valuetype">
          Type
        </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={!vmaps || size(vmaps) === 0} cols={5}>
      {props => (
        <Tbody {...props}>
          {vmaps.map(
            (item: Object, index: number): React.Element<any> => (
              <Tr
                key={`vmap_${item.id}`}
                first={index === 0}
                observeElement={index === 0 && '.pane'}
              >
                <Td className="narrow">{item.id}</Td>
                <Td className="narrow">{item.mapsize}</Td>
                <Td className="name">
                  <Link to={`/system/values?paneId=${item.id}`}>
                    {item.name}
                  </Link>
                </Td>
                <Td className="narrow">
                  <AutoComponent>{item.throws_exception}</AutoComponent>
                </Td>
                <Td className="narrow">{item.valuetype}</Td>
              </Tr>
            )
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  withSort('valuemapsCompact', 'vmaps', sortDefaults.valuemapsCompact),
  pure(['vmaps', 'sortData'])
)(MappersTable);
