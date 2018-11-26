/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import size from 'lodash/size';

import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import actions from '../../store/api/actions';
import JobLog from './tabs/log/index';
import JobCode from './tabs/code';
import JobResults from './tabs/results/index';
import JobMappers from './tabs/mappers/index';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import Controls from '../jobs/controls';
import { SimpleTabs, SimpleTab } from '../../components/SimpleTabs';
import withTabs from '../../hocomponents/withTabs';
import titleManager from '../../hocomponents/TitleManager';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';
import { normalizeName } from '../../components/utils';
import queryControl from '../../hocomponents/queryControl';
import Search from '../../containers/search';
import mapProps from 'recompose/mapProps';
import { DATES, DATE_FORMATS } from '../../constants/dates';
import { formatDate } from '../../helpers/date';
import {
  resourceSelector,
  querySelector,
  paramSelector,
} from '../../selectors';
import lifecycle from 'recompose/lifecycle';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import unsync from '../../hocomponents/unsync';

type Props = {
  job: Object,
  location: Object,
  children: ?Object,
  tabQuery: string,
  searchQuery?: string,
  changeSearchQuery: Function,
};

const JobPage = ({
  job,
  location,
  tabQuery,
  searchQuery,
  changeSearchQuery,
  date,
  linkDate,
}: Props) => (
  <div>
    <Headbar>
      <Breadcrumbs>
        <Crumb link="/jobs"> Jobs </Crumb>
        <Crumb>{normalizeName(job)}</Crumb>
        <CrumbTabs
          tabs={[
            'Instances',
            { title: 'Mappers', suffix: `(${size(job.mappers)})` },
            'Code',
            'Log',
          ]}
        />
      </Breadcrumbs>
      <Pull right>
        <Controls {...job} big />
        {tabQuery === 'instances' && (
          <Search
            defaultValue={searchQuery}
            onSearchUpdate={changeSearchQuery}
            resource="job"
          />
        )}
      </Pull>
    </Headbar>
    <SimpleTabs activeTab={tabQuery}>
      <SimpleTab name="instances">
        <JobResults {...{ job, date, location, linkDate }} />
      </SimpleTab>
      <SimpleTab name="code">
        <JobCode {...{ job, date, location, linkDate }} />
      </SimpleTab>
      <SimpleTab name="log">
        <JobLog {...{ job, date, location, linkDate }} />
      </SimpleTab>
      <SimpleTab name="mappers">
        <JobMappers {...{ job, date, location, linkDate }} />
      </SimpleTab>
    </SimpleTabs>
  </div>
);

const jobSelector: Function = (state: Object, props: Object): Object =>
  state.api.jobs.data.find(
    (job: Object) => parseInt(props.params.id, 10) === parseInt(job.id, 10)
  );

const selector: Object = createSelector(
  [
    resourceSelector('jobs'),
    jobSelector,
    querySelector('date'),
    paramSelector('id'),
  ],
  (meta, job, date, id) => ({
    meta,
    job,
    date,
    id: parseInt(id, 10),
  })
);

export default compose(
  connect(
    selector,
    {
      load: actions.jobs.fetch,
      fetch: actions.jobs.fetch,
      unsync: actions.jobs.unsync,
    }
  ),
  mapProps(
    ({ date, ...rest }: Props): Object => ({
      date: date || DATES.PREV_DAY,
      ...rest,
    })
  ),
  mapProps(
    ({ date, ...rest }: Props): Object => ({
      fetchParams: { lib_source: true, date: formatDate(date).format() },
      linkDate: formatDate(date).format(DATE_FORMATS.URL_FORMAT),
      date,
      ...rest,
    })
  ),
  patch('load', ['fetchParams', 'id']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { date, fetch, id }: Props = this.props;

      if (date !== nextProps.date || id !== nextProps.id) {
        fetch(nextProps.fetchParams, nextProps.id);
      }
    },
  }),
  titleManager(({ job }): string => job.name),
  queryControl('search'),
  withTabs('instances'),
  unsync(),
  onlyUpdateForKeys(['job', 'location', 'children'])
)(JobPage);
