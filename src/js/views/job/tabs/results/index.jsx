/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withContext from 'recompose/withContext';
import withHandlers from 'recompose/withHandlers';
import lifecycle from 'recompose/lifecycle';

import ResultsTable from './table';
import ResultsToolbar from './toolbar';
import LoadMore from '../../../../components/load_more';
import patch from '../../../../hocomponents/patchFuncArgs';
import actions from '../../../../store/api/actions';

const JobResults = ({
  job,
  location,
  onLoadMore,
}: {
  job: Object,
  location: Object,
  onLoadMore: Function,
}) => (
  <div className="job-results">
    <ResultsToolbar {...{ location }} />
    <ResultsTable results={job.results} />
    <LoadMore dataObject={job.results} onLoadMore={onLoadMore} />
  </div>
);

export default compose(
  withContext(
    {
      route: PropTypes.object,
      params: PropTypes.object,
    },
    ({ route, params }) => ({ route, params })
  ),
  connect(
    () => ({}),
    { fetchResults: actions.jobs.fetchResults }
  ),
  patch('fetchResults', ['job']),
  lifecycle({
    componentDidMount() {
      this.props.fetchResults();
    },
  }),
  withHandlers({
    onLoadMore: ({ job, fetchResults }: { job: Object, fetchResults: Function }) => () => {
      const { offset, limit } = job.results;
      fetchResults(offset + limit, limit);
    },
  })
)(JobResults);
