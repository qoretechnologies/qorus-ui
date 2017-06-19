// @flow
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

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
import { Control } from '../../components/controls';
import { sortDefaults } from '../../constants/sort';
import withSort from '../../hocomponents/sort';
import loadMore from '../../hocomponents/loadMore';

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
  limit: number,
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
  sortData,
  onSortChange,
}: Props): React.Element<any> => (
  <div>
    <JobsToolbar
      selected={selected}
      selectedIds={selectedIds}
      onCSVClick={onCSVClick}
    />
    <JobsTable
      collection={jobs}
      openPane={openPane}
      closePane={closePane}
      paneId={paneId}
      date={date}
      sortData={sortData}
      onSortChange={onSortChange}
      canLoadMore={canLoadMore}
    />
    { canLoadMore && (
      <Control
        label={`Load ${limit} more...`}
        btnStyle="success"
        big
        onClick={handleLoadMore}
      />
    )}
  </div>
);

const filterSearch: Function = (
  search: string
): Function => (
  jobs: Array<Object>
): Array<Object> => (
  findBy('name', search, jobs)
);

const collectionSelector: Function = createSelector(
  [
    resourceSelector('jobs'),
    querySelector('search'),
  ], (jobs, search) => filterSearch(search)(jobs.data)
);

const selector: Function = createSelector(
  [
    resourceSelector('jobs'),
    resourceSelector('systemOptions'),
    collectionSelector,
    querySelector('date'),
  ], (meta, systemOptions, jobs, date) => ({
    meta,
    systemOptions,
    jobs,
    date,
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
  withSort('jobs', 'jobs', sortDefaults.jobs),
  loadMore('jobs', 'jobs', true, 50),
  mapProps(({ date, ...rest }: Props): Object => ({
    date: date || DATES.PREV_DAY,
    ...rest,
  })),
  mapProps(({ date, ...rest }: Props): Object => ({
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
  withPane(
    JobsDetail,
    [
      'systemOptions',
      'location',
    ],
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
  ]),
  unsync()
)(JobsView);
