// @flow
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

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
import JobsDetail from './detail';
import JobsToolbar from './toolbar';
import JobsTable from './table';
import Box from '../../components/box';
import { sortDefaults } from '../../constants/sort';
import withSort from '../../hocomponents/sort';
import loadMore from '../../hocomponents/loadMore';
import withInfoBar from '../../hocomponents/withInfoBar';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';

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
  limit: number,
  isTablet: boolean,
  infoTotalCount: number,
  infoEnabled: number,
  infoWithAlerts: number,
  user: Object,
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
  sortData,
  onSortChange,
  isTablet,
  infoEnabled,
  infoTotalCount,
  infoWithAlerts,
}: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb>Jobs</Crumb>
    </Breadcrumbs>
    <Box top>
      <JobsToolbar
        selected={selected}
        selectedIds={selectedIds}
        onCSVClick={onCSVClick}
        collectionCount={jobs.length}
        collectionTotal={infoTotalCount}
        withAlertsCount={infoWithAlerts}
        enabledCount={infoEnabled}
      />
    </Box>
    <Box noPadding>
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
      />
    </Box>
    {canLoadMore && (
      <ButtonGroup style={{ padding: '0 15px 15px 15px' }}>
        <Button
          text={`Showing ${jobs.length} of ${infoTotalCount}`}
          intent={Intent.NONE}
          className="pt-minimal"
        />
        <Button
          text={`Show ${limit} more...`}
          intent={Intent.PRIMARY}
          onClick={handleLoadMore}
        />
        <Button
          text="Show all"
          intent={Intent.PRIMARY}
          onClick={handleLoadAll}
        />
      </ButtonGroup>
    )}
  </div>
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
  connect(
    selector,
    {
      load: actions.jobs.fetch,
      fetch: actions.jobs.fetch,
      unsync: actions.jobs.unsync,
      selectNone: actions.jobs.selectNone,
    }
  ),
  withInfoBar('jobs'),
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
    componentWillReceiveProps(nextProps: Props) {
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
  pure([
    'jobs',
    'date',
    'systemOptions',
    'selected',
    'selectedIds',
    'paneId',
    'canLoadMore',
    'isTablet',
  ]),
  unsync()
)(JobsView);
