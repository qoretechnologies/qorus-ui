/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';

import { findBy } from '../../../../helpers/search';
import { Table, Thead, Tbody, Tr, Th } from '../../../../components/new_table';
import InstanceRow from './row';
import sort from '../../../../hocomponents/sort';
import showIfPassed from '../../../../hocomponents/show-if-passed';
import { sortDefaults } from '../../../../constants/sort';

const ResultTable = ({
  data = [],
  sortData,
  onSortChange,
  jobQuery,
  changeJobQuery,
}: {
  data: Array<Object>,
  sortData: Object,
  onSortChange: Function,
  jobQuery: string | number,
  changeJobQuery: Function,
}) => (
  <Table
    fixed
    condensed
    hover
    striped
    className="resource-table"
    marginBottom={40}
  >
    <Thead>
      <Tr
        onSortChange={onSortChange}
        sortData={sortData}
      >
        <Th name="job_instanceid" className="big">ID</Th>
        <Th className="narrow">Detail</Th>
        <Th name="jobstatus" className="medium">Status</Th>
        <Th name="started" className="big">Started</Th>
        <Th name="modified" className="big">Modified</Th>
        <Th name="completed" className="big">Completed</Th>
      </Tr>
    </Thead>
    <Tbody>
      {data.map((item: Object): React.Element<InstanceRow> => (
        <InstanceRow
          key={`item_${item.job_instanceid}`}
          active={item.job_instanceid === parseInt(jobQuery, 10)}
          changeJobQuery={changeJobQuery}
          {...item}
        />
      ))}
    </Tbody>
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
  sort('job-results', 'data', sortDefaults.jobResults),
  pure([
    'jobQuery',
    'sortData',
    'data',
  ])
)(ResultTable);
