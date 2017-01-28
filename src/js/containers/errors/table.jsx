/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import { Table, Thead, Tbody, Tr, Th } from '../../components/new_table';
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
}

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
}: Props): React.Element<any> => (
  <Table
    striped
    condensed
    fixed={fixed}
    height={height}
  >
    <Thead>
      <Tr
        sortData={sortData}
        onSortChange={onSortChange}
      >
        <Th name="error">Error</Th>
        { !compact && (
          <Th name="description">Description</Th>
        )}
        <Th className="medium" name="severity">Severity</Th>
        <Th className="narrow" name="retry_flag">Retry</Th>
        <Th className="narrow" name="retry_delay_secs">Delay</Th>
        <Th className="medium" name="business_flag">Bus. Flag</Th>
        { type === 'workflow' && (
          <Th className="medium" name="manually_updated">Updated</Th>
        )}
        <Th className="medium">-</Th>
      </Tr>
    </Thead>
    <Tbody>
      { data.map((error: Object, index: number): React.Element<ErrorRow> => (
        <ErrorRow
          key={index}
          data={error}
          compact={compact}
          type={type}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </Tbody>
  </Table>
);

export default compose(
  checkData((props: Object) => props.data.length > 0),
  withSort(
    (props: Object): string => `${props.type}Errors`,
    'data',
    (props: Object): Object => sortDefaults[`${props.type}Errors`]
  )
)(ErrorsTable);
