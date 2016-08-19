/* @flow */
import React from 'react';
import classNames from 'classnames';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import { findBy } from '../../../../helpers/search';
import Date from '../../../../components/date';
import Label from '../../../../components/label';
import Table, { Section, Row, Th, Td } from '../../../../components/table';
import showIfPassed from '../../../../hocomponents/show-if-passed';

function getStyleByStatus(status: string): string {
  return {
    error: 'danger',
    complete: 'success',
    crash: 'warning',
  }[status.toLowerCase()] || 'info';
}

const ResultTable = ({ data = [] }: { data: Array<Object> }) => (
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
        <Th>Id</Th>
        <Th>Status</Th>
        <Th>Buss. Err.</Th>
        <Th>Job</Th>
        <Th>Started</Th>
        <Th>Modified</Th>
      </Row>
    </Section>
    <Section type="body">
      {data.map((item, idx) => (
        <Row key={`item_${item.job_instanceid}`}>
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

export default compose(
  showIfPassed(({ results }) => results && results.data),
  mapProps(props => ({
    ...props,
    data: findBy(
      ['job_instanceid', 'name'],
      props.searchQuery,
      props.results.data),
  })),
  showIfPassed(
    ({ data }) => data.length > 0,
    <p className="data-not-found">Data not found</p>
  )
)(ResultTable);
