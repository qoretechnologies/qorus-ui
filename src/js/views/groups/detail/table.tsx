// @flow
import isObject from 'lodash/isObject';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import ContentByType from '../../../components/ContentByType';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import EnhancedTable from '../../../components/EnhancedTable';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import NoDataIf from '../../../components/NoDataIf';
import PaneItem from '../../../components/pane_item';
import { sortDefaults } from '../../../constants/sort';
import { buildLinkToInterfaceId, normalizeItem } from '../../../helpers/interfaces';

type Props = {
  data: Array<Object>;
  columns: Array<string>;
  type: string;
};

const GroupDetailTable: Function = ({
  data,
  columns = [],
  type,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const renderColumns: Function = (item: any) => [
    <NameColumn
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      name={isObject(item) ? item.name : item}
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
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
                    // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                    (item: any, index: number) => (
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
