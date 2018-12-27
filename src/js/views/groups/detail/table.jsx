// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import upperFirst from 'lodash/upperFirst';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../../components/new_table';
import NoDataIf from '../../../components/NoDataIf';
import PaneItem from '../../../components/pane_item';
import {
  normalizeItem,
  buildLinkToInterfaceId,
} from '../../../helpers/interfaces';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import ContentByType from '../../../components/ContentByType';
import EnhancedTable from '../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';

type Props = {
  data: Array<Object>,
  columns: Array<string>,
  type: string,
};

const GroupDetailTable: Function = ({
  data,
  columns: columns = [],
  type,
}: Props): React.Element<any> => {
  const renderColumns: Function = (item: Object) => [
    <NameColumn
      name={item.name}
      link={buildLinkToInterfaceId(type, item.id)}
      type={type}
    />,
    ...columns.map((column: string, index: number) => (
      <Td key={index}>
        <ContentByType content={item[column]} inTable />
      </Td>
    )),
  ];

  return (
    <PaneItem title={type}>
      <NoDataIf condition={!data || data.length === 0}>
        {() => (
          <EnhancedTable
            collection={data}
            tableId={`groupDetail-${type}`}
            sortDefault={sortDefaults.groupDetail}
          >
            {({ collection, sortData, onSortChange }: EnhancedTableProps) => (
              <Table condensed striped fixed>
                <Thead>
                  <FixedRow {...{ sortData, onSortChange }}>
                    <NameColumnHeader />
                    {columns.map((column, index) => (
                      <Th key={index} icon="info-sign">
                        {upperFirst(column)}
                      </Th>
                    ))}
                  </FixedRow>
                </Thead>
                <Tbody>
                  {collection.map(
                    (item: Object, index: number): React.Element<Tr> => (
                      <Tr key={index} first={index === 0}>
                        {renderColumns(normalizeItem(item))}
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            )}
          </EnhancedTable>
        )}
      </NoDataIf>
    </PaneItem>
  );
};

export default compose(pure(['data']))(GroupDetailTable);
