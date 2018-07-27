/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Box from '../../components/box';
import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import actions from '../../store/api/actions';
import JobLog from './tabs/log/index';
import JobCode from './tabs/code';
import JobResults from './tabs/results/index';
import JobMappers from './tabs/mappers/index';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Controls from '../jobs/controls';
import Tabs, { Pane } from '../../components/tabs';
import withTabs from '../../hocomponents/withTabs';

const jobSelector = (state, props) => {
  const {
    api: {
      jobs: { data },
    },
  } = state;
  const {
    routeParams: { id },
  } = props;

  const jobId = parseInt(id, 10);
  const job = data.find(item => parseInt(item.jobid, 10) === jobId);

  return job || { id, loading: false, sync: false };
};

const selector = createSelector([jobSelector], job => ({ job }));

const JobPage = ({
  job,
  location,
  handleTabChange,
  tabQuery,
}: {
  job: Object,
  location: Object,
  children: ?Object,
  handleTabChange: Function,
  tabQuery?: string,
}) => (
  <div>
    <Breadcrumbs>
      <Crumb link="/jobs"> Jobs </Crumb>
      <Crumb>
        {job.name} <small>{job.version}</small> <small>({job.id})</small>
      </Crumb>
    </Breadcrumbs>
    <div className="pull-right">
      <Controls {...job} />
    </div>
    <Box top>
      <Tabs active={tabQuery} onChange={handleTabChange} noContainer>
        <Pane name="List">
          <JobResults job={job} location={location} />
        </Pane>
        <Pane name="Code">
          <JobCode job={job} location={location} />
        </Pane>
        <Pane name="Log">
          <JobLog job={job} location={location} />
        </Pane>
        <Pane name="Mappers">
          <JobMappers job={job} location={location} />
        </Pane>
      </Tabs>
    </Box>
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
  withTabs('list')
)(JobPage);
