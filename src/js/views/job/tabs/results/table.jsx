/* @flow */
import React from 'react';
import classNames from 'classnames';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import { findBy } from '../../../../helpers/search';
import Date from '../../../../components/date';
import Label from '../../../../components/label';
import Table, { Section, Row, Th, Td } from '../../../../components/table';
import sort from '../../../../hocomponents/sort';
import showIfPassed from '../../../../hocomponents/show-if-passed';
import { sortDefaults } from '../../../../constants/sort';

function getStyleByStatus(status: string): string {
  return {
    error: 'danger',
    complete: 'success',
    crash: 'warning',
  }[status.toLowerCase()] || 'info';
}

const ResultTable = ({
  data = [],
  sortData,
  onSortChange,
  onSelectJobResult,
}: {
  data: Array<Object>,
  sortData: Object,
  onSortChange: Function,
  onSelectJobResult: Function,
}) => (
  <Table
    className={classNames(
      'table',
      'table-stripped',
      'table-condensed',
      'table-hover',
      'table-fixed',
      'table--data'
    )}
  >
    <Section type="head">
      <Row>
        <Th />
        <Th name="job_instanceid" {...{ sortData, onSortChange }}>Id</Th>
        <Th name="jobstatus" {...{ sortData, onSortChange }}>Status</Th>
        <Th>Buss. Err.</Th>
        <Th name="name" {...{ sortData, onSortChange }}>Job</Th>
        <Th name="started" {...{ sortData, onSortChange }}>Started</Th>
        <Th name="modified" {...{ sortData, onSortChange }}>Modified</Th>
      </Row>
    </Section>
    <Section type="body">
      {data.map((item, idx) => (
        <Row key={`item_${item.job_instanceid}`} onClick={() => onSelectJobResult(item)}>
          <Td>{idx + 1}</Td>
          <Td>{item.job_instanceid}</Td>
          <Td>
            <Label style={getStyleByStatus(item.jobstatus)}>{item.jobstatus}</Label>
          </Td>
          <Td />
          <Td>{item.name}</Td>
          <Td><Date date={item.started} /></Td>
          <Td><Date date={item.modified} /></Td>
        </Row>
      ))}
    </Section>
  </Table>
);


const hideWhileLoading = showIfPassed(({ results }) => results && results.data);

const filterResults = mapProps(props => ({
  ...props,
  data: findBy(
    ['job_instanceid', 'name'],
    props.searchQuery,
    props.results.data),
}));

const showNoData = showIfPassed(
  ({ data }) => data.length > 0,
  <p className="data-not-found">Data not found</p>
);

export default compose(
  hideWhileLoading,
  filterResults,
  showNoData,
  sort('job-results', 'data', sortDefaults.jobResults)
)(ResultTable);
