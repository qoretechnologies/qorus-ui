/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import withSort from '../../hocomponents/sort';
import { NameColumnHeader } from '../../components/NameColumn';
import checkData from '../../hocomponents/check-no-data';
import ErrorRow from './row';
import { sortDefaults } from '../../constants/sort';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';

type Props = {
  type: string,
  data: Array<Object>,
  compact?: boolean,
  onSortChange: Function,
  onEditClick: Function,
  onDeleteClick: Function,
  sortData: Object,
  height: string | number,
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
}: Props): React.Element<any> => (
  <Table striped condensed fixed height={height} key={data.length}>
    <Thead>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <NameColumnHeader name="error" />
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
      </FixedRow>
    </Thead>
    <DataOrEmptyTable
      condition={!data || data.length === 0}
      cols={type === 'workflow' ? (compact ? 7 : 8) : compact ? 6 : 7}
    >
      {props => (
        <Tbody {...props}>
          {data.map(
            (error: Object, index: number): React.Element<ErrorRow> => (
              <ErrorRow
                first={index === 0}
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
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  withSort(
    (props: Object): string => `${props.type}Errors`,
    'data',
    (props: Object): Object => sortDefaults[`${props.type}Errors`]
  )
)(ErrorsTable);
