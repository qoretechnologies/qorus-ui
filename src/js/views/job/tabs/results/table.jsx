/* @flow */
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import { findBy } from '../../../../helpers/search';
import Date from '../../../../components/date';
import Label from '../../../../components/label';
import Table, { Section, Row, Th, Td } from '../../../../components/table';
import InstanceRow from './row';
import sort from '../../../../hocomponents/sort';
import showIfPassed from '../../../../hocomponents/show-if-passed';
import selectableResult from '../../../../hocomponents/jobs/selectable-result';
import { sortDefaults } from '../../../../constants/sort';
import actions from '../../../../store/api/actions';

const ResultTable = ({
  data = [],
  sortData,
  onSortChange,
  selectResult,
  updateDone,
}: {
  data: Array<Object>,
  sortData: Object,
  onSortChange: Function,
  selectResult: Function,
  updateDone: Function,
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
        <InstanceRow
          key={`item_${item.job_instanceid}`}
          item={item}
          selectResult={selectResult}
          updateDone={updateDone}
        >
          <Td>{idx + 1}</Td>
          <Td>{item.job_instanceid}</Td>
          <Td>
            <Label style={`label status-${item.jobstatus.toLowerCase()}`}>{item.jobstatus}</Label>
          </Td>
          <Td />
          <Td className="name">{item.name}</Td>
          <Td><Date date={item.started} /></Td>
          <Td><Date date={item.modified} /></Td>
        </InstanceRow>
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
  connect(
    () => ({}),
    {
      updateDone: actions.jobs.instanceUpdateDone,
    }
  ),
  hideWhileLoading,
  filterResults,
  showNoData,
  selectableResult,
  sort('job-results', 'data', sortDefaults.jobResults)
)(ResultTable);
