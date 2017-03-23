/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/onlyUpdateForKeys';

import ResultsTable from './table';
import ResultsToolbar from './toolbar';
import { formatDate } from '../../../../helpers/date';
import LoadMore from '../../../../components/load_more';
import getRouterContext from '../../../../hocomponents/get-router-context';
import patch from '../../../../hocomponents/patchFuncArgs';
import actions from '../../../../store/api/actions';
import queryControl from '../../../../hocomponents/queryControl';
import Detail from './detail';

const JobResults = ({
  job,
  location,
  onLoadMore,
  jobQuery,
  changeJobQuery,
}: {
  job: Object,
  jobResult: Object,
  location: Object,
  onLoadMore: Function,
  jobQuery: string | number,
  changeJobQuery: Function,
}) => (
  <div className="job-results">
    <ResultsToolbar {...{ location, job }} />
    <div className="job-results-table">
      <ResultsTable
        results={job.results}
        location={location}
        searchQuery={location.query.q}
        changeJobQuery={changeJobQuery}
        jobQuery={jobQuery}
      />
      <LoadMore dataObject={job.results} onLoadMore={onLoadMore} />
      { jobQuery && jobQuery !== '' ? (
        <Detail
          location={location}
          changeJobQuery={changeJobQuery}
        />
      ) : null }
    </div>
  </div>
);

const addUrlParams = mapProps((props:Object) => {
  const { location: { query } } = props;
  const { filter: status, date } = query;
  const searchableDate = formatDate(date).format();
  return {
    ...props,
    urlParams: {
      statuses: status !== 'all' ? status : undefined,
      date: searchableDate,
    },
  };
});

const fetchOnMount = lifecycle({
  componentWillMount() {
    this.props.fetchResults();
  },
});

const fetchOnQueryParamsUpdate = lifecycle({
  componentWillReceiveProps(newProps) {
    const { clearResults, fetchResults, location: { query: newQuery } } = newProps;
    const { location: { query } } = this.props;

    if (query.filter !== newQuery.filter || query.date !== newQuery.date) {
      clearResults();
      fetchResults();
    }
  },
});

const addLoadMoreHandler = withHandlers({
  onLoadMore: ({ job, fetchResults }: { job: Object, fetchResults: Function }) => () => {
    const { offset, limit } = job.results;
    fetchResults(offset + limit, limit);
  },
});

export default compose(
  getRouterContext,
  connect(
    () => ({}),
    {
      fetchResults: actions.jobs.fetchResults,
      clearResults: actions.jobs.clearResults,
    }
  ),
  addUrlParams,
  patch('fetchResults', ['job', 'urlParams']),
  patch('clearResults', ['job']),
  fetchOnMount,
  fetchOnQueryParamsUpdate,
  addLoadMoreHandler,
  queryControl('job'),
  pure([
    'job',
    'jobQuery',
    'location',
    'children',
  ])
)(JobResults);
