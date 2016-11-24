/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import Table, { Section, Row, Th } from '../../components/table';
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
}

const ErrorsTable: Function = ({
  data,
  compact,
  type,
  onSortChange,
  sortData,
  onEditClick,
  onDeleteClick,
}: Props): React.Element<any> => (
  <Table className="table table-striped table-condensed table-fixed table--data">
    <Section type="head">
      <Row>
        <Th name="error" { ...{ onSortChange, sortData } }>Error</Th>
        { !compact && (
          <Th name="description" { ...{ onSortChange, sortData } }>Description</Th>
        )}
        <Th name="severity" { ...{ onSortChange, sortData } }>Severity</Th>
        <Th name="retry_flag" { ...{ onSortChange, sortData } }>Retry</Th>
        <Th name="retry_delay_secs" { ...{ onSortChange, sortData } }>Delay</Th>
        <Th name="business_flag" { ...{ onSortChange, sortData } }>Bus. Flag</Th>
        { type === 'workflow' && (
          <Th name="manually_updated" { ...{ onSortChange, sortData } }>Updated</Th>
        )}
        <Th>-</Th>
      </Row>
    </Section>
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
