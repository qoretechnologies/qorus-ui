/* @flow */
import flowRight from 'lodash/flowRight';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import Box from '../../../../components/box';
import Flex from '../../../../components/Flex';
import { sortDefaults } from '../../../../constants/sort';
import { findBy } from '../../../../helpers/search';
import csv from '../../../../hocomponents/csv';
import loadMore from '../../../../hocomponents/loadMore';
import patch from '../../../../hocomponents/patchFuncArgs';
import queryControl from '../../../../hocomponents/queryControl';
import withSort from '../../../../hocomponents/sort';
import sync from '../../../../hocomponents/sync';
import unsync from '../../../../hocomponents/unsync';
import { querySelector, resourceSelector } from '../../../../selectors';
import actions from '../../../../store/api/actions';
import Detail from './detail';
import Table from './table';

type Props = {
  job: Object;
  location: Object;
  onLoadMore: Function;
  jobQuery: string | number;
  changeJobQuery: Function;
  instances: Array<Object>;
  date: string;
  limit: number;
  canLoadMore: Function;
  handleLoadMore: Function;
  loadMoreCurrent: number;
  sortData: Object;
  onSortChange: Function;
  isTablet: boolean;
  onCSVClick: Function;
  filter: string;
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
  loadMoreCurrent,
  sortData,
  onSortChange,
  isTablet,
  onCSVClick,
  job,
  filter,
}: Props) => (
  <Flex>
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
        loadMoreCurrent={loadMoreCurrent}
        sortData={sortData}
        onSortChange={onSortChange}
        isTable={isTablet}
        onCSVClick={onCSVClick}
        job={job}
        filter={filter}
      />
    </Box>
    {jobQuery && jobQuery !== '' ? (
      <Detail location={location} changeJobQuery={changeJobQuery} />
    ) : null}
  </Flex>
);

const filterInstances: Function =
  (id): Function =>
  (instances: Array<Object>): Array<Object> =>
    id
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'jobid' does not exist on type 'Object'.
        instances.filter((instance: Object): boolean => instance.jobid === id)
      : instances;

const filterSearch: Function =
  (search: string): Function =>
  (instances: Array<Object>): Array<Object> =>
    findBy(['id', 'jobstatus'], search, instances);

const idSelector: Function = (state, props) => (props.job ? props.job.id : null);

const collectionSelector: Function = createSelector(
  [querySelector('search'), resourceSelector('instances'), idSelector],
  (search: string, instances: Object, id: number) =>
    flowRight(
      filterSearch(search),
      filterInstances(id)
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    )(instances.data)
);

// @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
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
    // @ts-ignore ts-migrate(2339) FIXME: Property 'tablet' does not exist on type 'Object'.
    isTablet: settings.tablet,
  })
);

export default compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'instances' does not exist on type '{}'.
    load: actions.instances.fetchInstances,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'instances' does not exist on type '{}'.
    fetch: actions.instances.fetchInstances,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'instances' does not exist on type '{}'.
    unsync: actions.instances.unsync,
  }),
  withSort('instances', 'instances', sortDefaults.instances),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
  loadMore('instances', 'instances'),
  mapProps(
    ({ job, ...rest }: Props): Object => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      id: job.id,
      job,
      ...rest,
    })
  ),
  patch('load', ['id', false, 'offset', 'linkDate', 'filter', 'limit', 'sortDir', 'sort']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { id, date, filter, fetch, sort, sortDir, offset, changeOffset } = this.props;

      // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
      if (date !== nextProps.date && nextProps.offset !== 0) {
        changeOffset(0);
      } else if (
        date !== nextProps.date ||
        filter !== nextProps.filter ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Props'.
        sort !== nextProps.sort ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'sortDir' does not exist on type 'Props'.
        sortDir !== nextProps.sortDir ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
        offset !== nextProps.offset
      ) {
        fetch(
          id,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
          nextProps.offset !== 0,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
          nextProps.offset,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'linkDate' does not exist on type 'Props'... Remove this comment to see the full error message
          nextProps.linkDate,
          nextProps.filter,
          nextProps.limit,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'sortDir' does not exist on type 'Props'.
          nextProps.sortDir,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Props'.
          nextProps.sort
        );
      }
    },
  }),
  csv('instances', 'instances'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
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
    'filter',
  ])
)(JobResults);
