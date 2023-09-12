// @flow
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import size from 'lodash/size';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import CsvControl from '../../components/CsvControl';
import Flex from '../../components/Flex';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import { DATES } from '../../constants/dates';
import { sortDefaults } from '../../constants/sort';
import Search from '../../containers/search';
import { findBy } from '../../helpers/search';
import { formatDate } from '../../helpers/workflows';
import titleManager from '../../hocomponents/TitleManager';
import withCSV from '../../hocomponents/csv';
import hasInterfaceAccess from '../../hocomponents/hasInterfaceAccess';
import loadMore from '../../hocomponents/loadMore';
import withPane from '../../hocomponents/pane';
import patch from '../../hocomponents/patchFuncArgs';
import queryControl from '../../hocomponents/queryControl';
import selectable from '../../hocomponents/selectable';
import withSort from '../../hocomponents/sort';
import sync from '../../hocomponents/sync';
import unsync from '../../hocomponents/unsync';
import { querySelector, resourceSelector } from '../../selectors';
import actions from '../../store/api/actions';
import JobsDetail from './pane';
import JobsTable from './table';

type Props = {
  jobs: Array<Object>;
  date: string;
  selectNone: Function;
  fetch: Function;
  fetchParams: any;
  systemOptions: Array<Object>;
  location: any;
  selected: string;
  onCSVClick: Function;
  paneId: string | number;
  openPane: Function;
  closePane: Function;
  selectedIds: Array<number>;
  sortData: any;
  onSortChange: Function;
  canLoadMore: boolean;
  handleLoadMore: Function;
  handleLoadAll: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  limit: number;
  isTablet: boolean;
  infoTotalCount: number;
  infoEnabled: number;
  infoWithAlerts: number;
  user: any;
  searchQuery: string;
  changeSearchQuery: Function;
  sortKeysObj: any;
};

const JobsView: Function = ({
  selected,
  selectedIds,
  onCSVClick,
  jobs,
  openPane,
  closePane,
  paneId,
  date,
  limit,
  canLoadMore,
  handleLoadMore,
  handleLoadAll,
  loadMoreCurrent,
  loadMoreTotal,
  sortData,
  onSortChange,
  isTablet,
  searchQuery,
  changeSearchQuery,
  sortKeysObj,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Flex>
    <Breadcrumbs>
      <Crumb active>
        <FormattedMessage id="Jobs" />
      </Crumb>
      <ReqoreControlGroup fixed style={{ marginLeft: 'auto' }}>
        <CsvControl onClick={onCSVClick} disabled={size(jobs) === 0} />
        <Search
          defaultValue={searchQuery}
          onSearchUpdate={changeSearchQuery}
          resource="jobs"
          focusOnMount
        />
      </ReqoreControlGroup>
    </Breadcrumbs>

    <Box top noPadding fill>
      <JobsTable
        collection={jobs}
        openPane={openPane}
        closePane={closePane}
        paneId={paneId}
        date={date}
        sortData={sortData}
        onSortChange={onSortChange}
        canLoadMore={canLoadMore}
        isTablet={isTablet}
        limit={limit}
        handleLoadAll={handleLoadAll}
        handleLoadMore={handleLoadMore}
        loadMoreCurrent={loadMoreCurrent}
        loadMoreTotal={loadMoreTotal}
        selected={selected}
        selectedIds={selectedIds}
        sortKeys={sortKeysObj}
      />
    </Box>
  </Flex>
);

const filterSearch: Function =
  (search: string): Function =>
  (jobs: Array<Object>): Array<Object> =>
    findBy('name', search, jobs);

const collectionSelector: Function = createSelector(
  [resourceSelector('jobs'), querySelector('search')],
  (jobs, search) => filterSearch(search)(jobs.data)
);

// @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
const settingsSelector = (state: any): any => state.ui.settings;

const selector: Function = createSelector(
  [
    resourceSelector('jobs'),
    resourceSelector('systemOptions'),
    resourceSelector('currentUser'),
    collectionSelector,
    querySelector('date'),
    settingsSelector,
  ],
  (meta, systemOptions, user, jobs, date, settings) => ({
    meta,
    systemOptions,
    jobs,
    date,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'tablet' does not exist on type 'Object'.
    isTablet: settings.tablet,
    user,
  })
);

export default compose(
  hasInterfaceAccess('jobs', 'Jobs'),
  connect(selector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    load: actions.jobs.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    fetch: actions.jobs.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    unsync: actions.jobs.unsync,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    selectNone: actions.jobs.selectNone,
  }),
  withSort('jobs', 'jobs', sortDefaults.jobs),
  loadMore('jobs', 'jobs', true, 50),
  mapProps(({ date, isTablet, user, ...rest }: Props): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    isTablet: isTablet || user.data.storage.sidebarOpen,
    date: date || DATES.PREV_DAY,
    user,
    ...rest,
  })),
  mapProps(({ date, ...rest }: Props): any => ({
    fetchParams: { date: formatDate(date).format() },
    date,
    ...rest,
  })),
  patch('load', ['fetchParams']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { date, selectNone, fetch }: Props = this.props;

      if (date !== nextProps.date) {
        selectNone();
        fetch(nextProps.fetchParams);
      }
    },
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
  withPane(JobsDetail, ['systemOptions', 'location', 'isTablet'], 'detail', 'jobs'),
  selectable('jobs'),
  withCSV('jobs', 'jobs'),
  titleManager('Jobs'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  pure([
    'jobs',
    'date',
    'systemOptions',
    'selected',
    'selectedIds',
    'paneId',
    'canLoadMore',
    'isTablet',
    'searchQuery',
  ]),
  unsync()
)(JobsView);
