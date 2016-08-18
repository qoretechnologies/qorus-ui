/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import { connect } from 'react-redux';

import ResultTable from './table';
import patch from '../../../../hocomponents/patchFuncArgs';
import actions from '../../../../store/api/actions';

const JobResults = ({ job }: { job: Object }) => (
  <div className="job-results">
    <ResultTable results={job.results} />
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
  })
)(JobResults);
