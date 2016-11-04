/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Nav, { NavLink } from '../../components/navlink';
import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import actions from '../../store/api/actions';
import JobHeader from './header';
import JobDescription from './description';
import JobLog from './tabs/log/index';
import JobCode from './tabs/code';
import JobResults from './tabs/results/index';
import JobMappers from './tabs/mappers/index';

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

const JobPage = ({
  job,
  location,
  children,
}: {
  job: Object,
  location: Object,
  children:? Object,
}) => (
  <div className="job-page">
    <JobHeader {...{ job, location }} />
    <JobDescription {...{ job }} />
    <div className="row">
      <div className="col-xs-12">
        <div className="job-tabs">
          <Nav path={location.pathname}>
            <NavLink to="./results">Results</NavLink>
            <NavLink to="./code">Code</NavLink>
            <NavLink to="./log">Log</NavLink>
            <NavLink to="./mappers">Mappers</NavLink>
          </Nav>
          <div className="job-tab" style={{ paddingTop: '10px' }}>
            {React.Children.map(
              children,
              child => React.cloneElement(
                child,
                { createElement: (Component, props) => <Component {...{ ...props, job }} /> }
              )
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export { JobLog, JobResults, JobMappers, JobCode };

export default compose(
  connect(
    selector,
    {
      load: actions.jobs.fetchLibSources,
    }
  ),
  patch('load', ['job']),
  sync('job'),
)(JobPage);

