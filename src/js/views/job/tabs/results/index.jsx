/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import lifecycle from 'recompose/lifecycle';

import ResultsTable from './table';
import ResultsToolbar from './toolbar';
import { formatDate } from '../../../../helpers/date';
import LoadMore from '../../../../components/load_more';
import getRouterContext from '../../../../hocomponents/get-router-context';
import patch from '../../../../hocomponents/patchFuncArgs';
import actions from '../../../../store/api/actions';

const JobResults = ({
  job,
  location,
  children,
  onLoadMore,
}: {
  job: Object,
  jobResult: Object,
  location: Object,
  children:? any,
  onLoadMore: Function,
}) => (
  <div className="job-results">
    <ResultsToolbar {...{ location, job }} />
    <div className="job-results-table">
      <ResultsTable
        results={job.results}
        location={location}
        searchQuery={location.query.q}
      />
      <LoadMore dataObject={job.results} onLoadMore={onLoadMore} />
    </div>
    {children}
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
  componentDidMount() {
    this.props.fetchResults();
  },
});

const fetchOnQueryParamsUpdate = lifecycle({
  componentDidUpdate(prevProps) {
    const { location: { query: prevQuery } } = prevProps;
    const { clearResults, fetchResults, location: { query } } = this.props;

    if (query.filter !== prevQuery.filter || query.date !== prevQuery.date) {
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
)(JobResults);
