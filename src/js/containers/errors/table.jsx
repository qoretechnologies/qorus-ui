/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  FixedRow,
  Th,
} from '../../components/new_table';
import withSort from '../../hocomponents/sort';
import checkData from '../../hocomponents/check-no-data';
import ErrorRow from './row';
import { sortDefaults } from '../../constants/sort';

type Props = {
  type: string,
  data: Array<Object>,
  compact?: boolean,
  onSortChange: Function,
  onEditClick: Function,
  onDeleteClick: Function,
  sortData: Object,
  height: string | number,
  fixed: boolean,
  RowComponent: any,
};

const ErrorsTable: Function = ({
  data,
  compact,
  type,
  onSortChange,
  sortData,
  onEditClick,
  onDeleteClick,
  height,
  fixed,
  RowComponent,
}: Props): React.Element<any> => (
  <Table striped condensed fixed={fixed} height={height} key={data.length}>
    <Thead>
      <RowComponent sortData={sortData} onSortChange={onSortChange}>
        <Th name="error">Error</Th>
        {!compact && <Th name="description">Description</Th>}
        <Th className="medium" name="severity">
          Severity
        </Th>
        <Th className="medium" name="status">
          Status
        </Th>
        <Th className="narrow" name="retry_delay_secs">
          Delay
        </Th>
        <Th className="medium" name="business_flag">
          Bus. Flag
        </Th>
        {type === 'workflow' && (
          <Th className="medium" name="manually_updated">
            Updated
          </Th>
        )}
        <Th className="medium">-</Th>
      </RowComponent>
    </Thead>
    <Tbody>
      {data.map(
        (error: Object, index: number): React.Element<ErrorRow> => (
          <ErrorRow
            key={index}
            data={error}
            compact={compact}
            type={type}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  checkData((props: Object) => props.data.length > 0),
  mapProps(
    ({ fixed, ...rest }: Props): Props => ({
      RowComponent: fixed ? FixedRow : Tr,
      fixed,
      ...rest,
    })
  ),
  withSort(
    (props: Object): string => `${props.type}Errors`,
    'data',
    (props: Object): Object => sortDefaults[`${props.type}Errors`]
  )
)(ErrorsTable);
