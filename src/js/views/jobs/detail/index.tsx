/* @flow */
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import size from 'lodash/size';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import Flex from '../../../components/Flex';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import { normalizeName } from '../../../components/utils';
import { DATES, DATE_FORMATS } from '../../../constants/dates';
import Search from '../../../containers/search';
import { formatDate } from '../../../helpers/date';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import titleManager from '../../../hocomponents/TitleManager';
import patch from '../../../hocomponents/patchFuncArgs';
import queryControl from '../../../hocomponents/queryControl';
import sync from '../../../hocomponents/sync';
import unsync from '../../../hocomponents/unsync';
import withTabs from '../../../hocomponents/withTabs';
import { paramSelector, querySelector, resourceSelector } from '../../../selectors';
import actions from '../../../store/api/actions';
import { countConfigItems } from '../../../utils';
import Controls from '../controls';
import JobsDetailTabs from '../tabs';

type Props = {
  job: any;
  location: any;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  children: any;
  tabQuery: string;
  searchQuery?: string;
  changeSearchQuery: Function;
  date: string;
  linkDate: string;
  fetch: Function;
  id: number;
  fetchParams: any;
  lib: any;
  configItems: any;
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
          // @ts-ignore ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
          { title: 'Mappers', suffix: `(${size(job.mappers)})` },
          // @ts-ignore ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'.
          { title: 'Valuemaps', suffix: `(${size(job.vmaps)})` },
          'Releases',
          'Code',
          'Log',
          'Info',
        ]}
      />
      <ReqoreControlGroup fixed style={{ marginLeft: 'auto' }}>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'wday' does not exist on type 'Object'. */}
        <Controls {...job} week={job.wday} expiry={job.expiry_date} big />
        {tabQuery === 'instances' && (
          <Search defaultValue={searchQuery} onSearchUpdate={changeSearchQuery} resource="job" />
        )}
      </ReqoreControlGroup>
    </Breadcrumbs>
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

const jobSelector: Function = (state: any, props: any): any =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.jobs.data.find(
    // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
    (job: any) => parseInt(props.params.id, 10) === parseInt(job.id, 10)
  );

const selector: any = createSelector(
  [resourceSelector('jobs'), jobSelector, querySelector('date'), paramSelector('id')],
  (meta, job, date, id) => ({
    meta,
    job,
    date,
    id: parseInt(id, 10),
  })
);

export default compose(
  connect(selector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    load: actions.jobs.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    fetch: actions.jobs.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    unsync: actions.jobs.unsync,
  }),
  mapProps(({ date, ...rest }: Props): any => ({
    date: date || DATES.PREV_DAY,
    ...rest,
  })),
  mapProps(({ date, ...rest }: Props): any => ({
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
  mapProps((props: any): any => ({
    ...props,
    lib: {
      ...{
        code: [
          {
            name: 'Job code',
            // @ts-ignore ts-migrate(2339) FIXME: Property 'job' does not exist on type 'Object'.
            body: props.job.code,
          },
        ],
      },
      // @ts-ignore ts-migrate(2339) FIXME: Property 'job' does not exist on type 'Object'.
      ...props.job.lib,
      fsm_triggers: props.job.fsm_triggers,
    },
    // @ts-ignore ts-migrate(2339) FIXME: Property 'job' does not exist on type 'Object'.
    configItems: rebuildConfigHash(props.job),
  })),
  // @ts-ignore ts-migrate(2339) FIXME: Property 'job' does not exist on type 'Object'.
  titleManager(({ job }): string => job.name),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('instances'),
  unsync(),
  onlyUpdateForKeys(['job', 'location', 'children'])
)(JobPage);
