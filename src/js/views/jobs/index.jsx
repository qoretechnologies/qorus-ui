// @flow
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import size from 'lodash/size';

import sync from '../../hocomponents/sync';
import withPane from '../../hocomponents/pane';
import unsync from '../../hocomponents/unsync';
import patch from '../../hocomponents/patchFuncArgs';
import selectable from '../../hocomponents/selectable';
import withCSV from '../../hocomponents/csv';
import { querySelector, resourceSelector } from '../../selectors';
import actions from '../../store/api/actions';
import { DATES } from '../../constants/dates';
import { formatDate } from '../../helpers/workflows';
import { findBy } from '../../helpers/search';
import JobsDetail from './pane';
import JobsTable from './table';
import Box from '../../components/box';
import { sortDefaults } from '../../constants/sort';
import withSort from '../../hocomponents/sort';
import loadMore from '../../hocomponents/loadMore';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import titleManager from '../../hocomponents/TitleManager';
import Headbar from '../../components/Headbar';
import queryControl from '../../hocomponents/queryControl';
import Pull from '../../components/Pull';
import CsvControl from '../../components/CsvControl';
import Search from '../../containers/search';
import Flex from '../../components/Flex';
import hasInterfaceAccess from '../../hocomponents/hasInterfaceAccess';

type Props = {
  jobs: Array<Object>,
  date: string,
  selectNone: Function,
  fetch: Function,
  fetchParams: Object,
  systemOptions: Array<Object>,
  location: Object,
  selected: string,
  onCSVClick: Function,
  paneId: string | number,
  openPane: Function,
  closePane: Function,
  selectedIds: Array<number>,
  sortData: Object,
  onSortChange: Function,
  canLoadMore: boolean,
  handleLoadMore: Function,
  handleLoadAll: Function,
  loadMoreCurrent: number,
  loadMoreTotal: number,
  limit: number,
  isTablet: boolean,
  infoTotalCount: number,
  infoEnabled: number,
  infoWithAlerts: number,
  user: Object,
  searchQuery: string,
  changeSearchQuery: Function,
  sortKeysObj: Object,
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
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active>Jobs</Crumb>
      </Breadcrumbs>
      <Pull right>
        <CsvControl onClick={onCSVClick} disabled={size(jobs) === 0} />
        <Search
          defaultValue={searchQuery}
          onSearchUpdate={changeSearchQuery}
          resource="jobs"
          focusOnMount
        />
      </Pull>
    </Headbar>
    <Box top noPadding>
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

const filterSearch: Function = (search: string): Function => (
  jobs: Array<Object>
): Array<Object> => findBy('name', search, jobs);

const collectionSelector: Function = createSelector(
  [resourceSelector('jobs'), querySelector('search')],
  (jobs, search) => filterSearch(search)(jobs.data)
);

const settingsSelector = (state: Object): Object => state.ui.settings;

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
    isTablet: settings.tablet,
    user,
  })
);

export default compose(
  hasInterfaceAccess('jobs', 'Jobs'),
  connect(
    selector,
    {
      load: actions.jobs.fetch,
      fetch: actions.jobs.fetch,
      unsync: actions.jobs.unsync,
      selectNone: actions.jobs.selectNone,
    }
  ),
  withSort('jobs', 'jobs', sortDefaults.jobs),
  loadMore('jobs', 'jobs', true, 50),
  mapProps(
    ({ date, isTablet, user, ...rest }: Props): Object => ({
      isTablet: isTablet || user.data.storage.sidebarOpen,
      date: date || DATES.PREV_DAY,
      user,
      ...rest,
    })
  ),
  mapProps(
    ({ date, ...rest }: Props): Object => ({
      fetchParams: { date: formatDate(date).format() },
      date,
      ...rest,
    })
  ),
  patch('load', ['fetchParams']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps (nextProps: Props) {
      const { date, selectNone, fetch }: Props = this.props;

      if (date !== nextProps.date) {
        selectNone();
        fetch(nextProps.fetchParams);
      }
    },
  }),
  withPane(
    JobsDetail,
    ['systemOptions', 'location', 'isTablet'],
    'detail',
    'jobs'
  ),
  selectable('jobs'),
  withCSV('jobs', 'jobs'),
  titleManager('Jobs'),
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
