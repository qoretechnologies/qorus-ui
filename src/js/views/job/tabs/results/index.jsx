/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import lifecycle from 'recompose/lifecycle';

import ResultTable from './table';
import LoadMore from '../../../../components/load_more';
import patch from '../../../../hocomponents/patchFuncArgs';
import actions from '../../../../store/api/actions';

const JobResults = ({ job, onLoadMore }: { job: Object, onLoadMore: Function }) => (
  <div className="job-results">
    <ResultTable results={job.results} />
    <LoadMore dataObject={job.results} onLoadMore={onLoadMore} />
  </div>
);

export default compose(
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
