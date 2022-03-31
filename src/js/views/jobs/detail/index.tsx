/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import size from 'lodash/size';

import sync from '../../../hocomponents/sync';
import patch from '../../../hocomponents/patchFuncArgs';
import actions from '../../../store/api/actions';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import Controls from '../controls';
import withTabs from '../../../hocomponents/withTabs';
import titleManager from '../../../hocomponents/TitleManager';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import JobsDetailTabs from '../tabs';
import { normalizeName } from '../../../components/utils';
import queryControl from '../../../hocomponents/queryControl';
import Search from '../../../containers/search';
import mapProps from 'recompose/mapProps';
import { DATES, DATE_FORMATS } from '../../../constants/dates';
import { formatDate } from '../../../helpers/date';
import {
  resourceSelector,
  querySelector,
  paramSelector,
} from '../../../selectors';
import lifecycle from 'recompose/lifecycle';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import unsync from '../../../hocomponents/unsync';
import Flex from '../../../components/Flex';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { countConfigItems } from '../../../utils';
import { FormattedMessage } from 'react-intl';

type Props = {
  job: Object,
  location: Object,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  children: ?Object,
  tabQuery: string,
  searchQuery?: string,
  changeSearchQuery: Function,
  date: string,
  linkDate: string,
  fetch: Function,
  id: number,
  fetchParams: Object,
  lib: Object,
  configItems: Object,
};

const JobPage = ({
  job,
  location,
  tabQuery,
  searchQuery,
  changeSearchQuery,
  date,
  linkDate,
  lib,
  configItems,
}: Props) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb link="/jobs">
          {' '}
          <FormattedMessage id="Jobs" />{' '}
        </Crumb>
        <Crumb>{normalizeName(job)}</Crumb>
        <CrumbTabs
          tabs={[
            'Instances',
            {
              title: 'Config',
              suffix: `(${countConfigItems(configItems)})`,
            },
            'Process',
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
            { title: 'Mappers', suffix: `(${size(job.mappers)})` },
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'.
            { title: 'Valuemaps', suffix: `(${size(job.vmaps)})` },
            'Releases',
            'Code',
            'Log',
            'Info',
          ]}
        />
      </Breadcrumbs>
      <Pull right>
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'wday' does not exist on type 'Object'. */ }
        <Controls {...job} week={job.wday} expiry={job.expiry_date} big />
        {tabQuery === 'instances' && (
          <Search
            defaultValue={searchQuery}
            onSearchUpdate={changeSearchQuery}
            resource="job"
          />
        )}
      </Pull>
    </Headbar>
    <JobsDetailTabs
      model={job}
      lib={lib}
      activeTab={tabQuery}
      date={date}
      linkDate={linkDate}
      location={location}
    />
  </Flex>
);

const jobSelector: Function = (state: Object, props: Object): Object =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.jobs.data.find(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
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
  connect(selector, {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    load: actions.jobs.fetch,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    fetch: actions.jobs.fetch,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    unsync: actions.jobs.unsync,
  }),
  mapProps(({ date, ...rest }: Props): Object => ({
    date: date || DATES.PREV_DAY,
    ...rest,
  })),
  mapProps(({ date, ...rest }: Props): Object => ({
    fetchParams: { lib_source: true, date: formatDate(date).format() },
    linkDate: formatDate(date).format(DATE_FORMATS.URL_FORMAT),
    date,
    ...rest,
  })),
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
  mapProps((props: Object): Object => ({
    ...props,
    lib: {
      ...{
        code: [
          {
            name: 'Job code',
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'job' does not exist on type 'Object'.
            body: props.job.code,
          },
        ],
      },
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'job' does not exist on type 'Object'.
      ...props.job.lib,
    },
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'job' does not exist on type 'Object'.
    configItems: rebuildConfigHash(props.job),
  })),
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'job' does not exist on type 'Object'.
  titleManager(({ job }): string => job.name),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('instances'),
  unsync(),
  onlyUpdateForKeys(['job', 'location', 'children'])
)(JobPage);
