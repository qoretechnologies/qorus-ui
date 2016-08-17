/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import actions from '../../store/api/actions';
import JobHeader from './header';
import JobDescription from './description';

const jobSelector = (state, props) => {
  const { api: { jobs: { data } } } = state;
  const { routeParams: { id } } = props;

  const jobId = parseInt(id, 10);
  const job = data.find(item => parseInt(item.jobid, 10) === jobId);

  return job || { id, loading: false, sync: false };
};

const selector = createSelector(
  [
    jobSelector,
  ],
  job => ({ job })
);

const JobPage = ({ job }: { job: Object }) => (
  <div className="job-page">
    <JobHeader {...{ job }} />
    <JobDescription {...{ job }} />
  </div>
);


export default compose(
  connect(
    selector,
    {
      load: actions.jobs.fetchLibSources,
    }
  ),
  patch('load', ['job']),
  sync('job')
)(JobPage);
