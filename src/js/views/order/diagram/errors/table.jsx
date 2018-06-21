// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';

import { Table, Thead, Tr, Th } from '../../../../components/new_table';
import check from '../../../../hocomponents/check-no-data';
import ErrorsRow from './row';
import { sortTable } from '../../../../helpers/table';

type Props = {
  data: Array<Object>,
  expand: boolean,
  stringifyError: Function,
  sortData: Object,
  setSortData: Function,
  onSortChange: Function,
  onModalMount: Function,
};

const DiagramErrorsTable: Function = ({
  data,
  expand,
  onSortChange,
  sortData,
  onModalMount,
}: Props): React.Element<Table> => (
  <Table hover condensed striped>
    <Thead>
      <Tr sortData={sortData} onSortChange={onSortChange}>
        <Th name="severity" className="narrow">
          -
        </Th>
        <Th name="severity">Severity</Th>
        <Th name="error" className="name">
          Error
        </Th>
        <Th name="created">Created</Th>
        <Th name="error_desc" className="text">
          Description
        </Th>
        <Th name="business_error">Bus.Err.</Th>
      </Tr>
    </Thead>
    {data.map(
      (error: Object, key: number): React.Element<ErrorsRow> => (
        <ErrorsRow
          key={`${key}_${error.error_instanceid}`}
          expand={expand}
          data={error}
          onModalMount={onModalMount}
          {...error}
        />
      )
    )}
  </Table>
);

export default compose(
  check(({ data }: Props): boolean => data && data.length > 0),
  withState('sortData', 'setSortData', {
    sortBy: 'created',
    sortByKey: {
      ignoreCase: true,
      direction: -1,
    },
  }),
  mapProps(
    ({ sortData, setSortData, data, ...rest }: Props): Props => ({
      onSortChange: ({ sortBy }: Object): Function =>
        setSortData(
          (currentSort: Object): Object => ({
            sortBy,
            sortByKey: {
              ignoreCase: true,
              direction:
                currentSort.sortBy === sortBy
                  ? currentSort.sortByKey.direction * -1
                  : currentSort.sortByKey.direction,
            },
          })
        ),
      data: sortTable(data, sortData),
      sortData,
      setSortData,
      ...rest,
    })
  ),
  pure(['data', 'sortData', 'expand'])
)(DiagramErrorsTable);
