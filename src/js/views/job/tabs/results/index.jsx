/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/onlyUpdateForKeys';
import flowRight from 'lodash/flowRight';

import Table from './table';
import Box from '../../../../components/box';
import patch from '../../../../hocomponents/patchFuncArgs';
import actions from '../../../../store/api/actions';
import queryControl from '../../../../hocomponents/queryControl';
import Detail from './detail';
import { findBy } from '../../../../helpers/search';
import { createSelector } from 'reselect';
import { querySelector, resourceSelector } from '../../../../selectors';
import loadMore from '../../../../hocomponents/loadMore';
import withSort from '../../../../hocomponents/sort';
import { sortDefaults } from '../../../../constants/sort';
import sync from '../../../../hocomponents/sync';
import csv from '../../../../hocomponents/csv';
import unsync from '../../../../hocomponents/unsync';

type Props = {
  job: Object,
  location: Object,
  onLoadMore: Function,
  jobQuery: string | number,
  changeJobQuery: Function,
  instances: Array<Object>,
  date: string,
  limit: number,
  canLoadMore: Function,
  handleLoadMore: Function,
  sortData: Object,
  onSortChange: Function,
  isTablet: boolean,
  onCSVClick: Function,
};

const JobResults = ({
  location,
  jobQuery,
  changeJobQuery,
  instances,
  date,
  limit,
  canLoadMore,
  handleLoadMore,
  sortData,
  onSortChange,
  isTablet,
  onCSVClick,
  job,
}: Props) => (
  <div>
    <Box top noPadding>
      <Table
        collection={instances}
        location={location}
        changeJobQuery={changeJobQuery}
        jobQuery={jobQuery}
        date={date}
        limit={limit}
        canLoadMore={canLoadMore}
        onLoadMore={handleLoadMore}
        sortData={sortData}
        onSortChange={onSortChange}
        isTable={isTablet}
        onCSVClick={onCSVClick}
        job={job}
      />
    </Box>
    {jobQuery && jobQuery !== '' ? (
      <Detail location={location} changeJobQuery={changeJobQuery} />
    ) : null}
  </div>
);

const filterInstances: Function = (id): Function => (
  instances: Array<Object>
): Array<Object> =>
  id
    ? instances.filter((instance: Object): boolean => instance.jobid === id)
    : instances;

const filterSearch: Function = (search: string): Function => (
  instances: Array<Object>
): Array<Object> => findBy(['id', 'jobstatus'], search, instances);

const idSelector: Function = (state, props) =>
  props.job ? props.job.id : null;

const collectionSelector: Function = createSelector(
  [querySelector('search'), resourceSelector('instances'), idSelector],
  (search: string, instances: Object, id: number) =>
    flowRight(
      filterSearch(search),
      filterInstances(id)
    )(instances.data)
);

const settingsSelector = (state: Object): Object => state.ui.settings;

const viewSelector: Function = createSelector(
  [
    resourceSelector('instances'),
    collectionSelector,
    resourceSelector('currentUser'),
    querySelector('filter'),
    settingsSelector,
  ],
  (meta, instances, user, filter, settings) => ({
    meta,
    sort: meta.sort,
    sortDir: meta.sortDir,
    instances,
    user,
    filter,
    isTablet: settings.tablet,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.instances.fetchInstances,
      fetch: actions.instances.fetchInstances,
      unsync: actions.instances.unsync,
    }
  ),
  withSort('instances', 'instances', sortDefaults.instances),
  loadMore('instances', 'instances'),
  mapProps(
    ({ job, ...rest }: Props): Object => ({
      id: job.id,
      job,
      ...rest,
    })
  ),
  patch('load', [
    'id',
    false,
    'offset',
    'linkDate',
    'filter',
    'limit',
    'sortDir',
    'sort',
  ]),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const {
        id,
        date,
        filter,
        fetch,
        sort,
        sortDir,
        offset,
        changeOffset,
      } = this.props;

      if (date !== nextProps.date && nextProps.offset !== 0) {
        changeOffset(0);
      } else if (
        date !== nextProps.date ||
        filter !== nextProps.filter ||
        sort !== nextProps.sort ||
        sortDir !== nextProps.sortDir ||
        offset !== nextProps.offset
      ) {
        fetch(
          id,
          nextProps.offset !== 0,
          nextProps.offset,
          nextProps.linkDate,
          nextProps.filter,
          nextProps.limit,
          nextProps.sortDir,
          nextProps.sort
        );
      }
    },
  }),
  csv('instances', 'instances'),
  queryControl('job'),
  unsync(),
  pure([
    'job',
    'jobQuery',
    'location',
    'children',
    'searchQuery',
    'instances',
    'sortData',
    'date',
    'linkDate',
    'limit',
    'sort',
    'offset',
    'sortDir',
  ])
)(JobResults);
