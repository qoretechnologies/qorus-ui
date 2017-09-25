// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import lifecycle from 'recompose/lifecycle';
import { createSelector } from 'reselect';
import mapProps from 'recompose/mapProps';
import moment from 'moment';
import capitalize from 'lodash/capitalize';

import { resourceSelector } from '../../../../../selectors';
import actions from '../../../../../store/api/actions';
import patch from '../../../../../hocomponents/patchFuncArgs';
import queryControl from '../../../../../hocomponents/queryControl';
import sync from '../../../../../hocomponents/sync';
import Chart from '../../../../../components/chart';
import { DATE_FORMATS } from '../../../../../constants/dates';
import { createPerfLineDatasets } from '../../../../../helpers/chart';
import EventsToolbar from './toolbar';

type Props = {
  location: Object,
  params: Object,
  id: number,
  minDateQuery: string,
  maxDateQuery: string,
  errQuery: string,
  errDescQuery: string,
  producerQuery: string,
  groupingQuery: string,
  successQuery: string,
  allQuery: string,
  changeAllQuery: Function,
  changeMinDateQuery: Function,
  changeMaxDateQuery: Function,
  changeErrQuery: Function,
  changeErrDescQuery: Function,
  changeGroupingQuery: Function,
  changeSuccessQuery: Function,
  changeProducerQuery: Function,
  defaultDate: string,
  searchData: Object,
  sort: string,
  sortDir: string,
  offset: number,
  limit: number,
  canLoadMore: boolean,
  handleLoadMore: Function,
  sortData: Object,
  onSortChange: Function,
  collection: Array<Object>,
  chartData: Object,
  countChartData: Object,
  settings: Object,
  width: number,
};

const SLAPerf: Function = ({
  chartData,
  countChartData,
  width,
  ...rest
}: Props): React.Element<any> => (
    <div className="tab-pane active">
      <EventsToolbar {...rest} />
      <div className="chart-view">
        <Chart
          type="line"
          id="perf"
          width={width}
          height={350}
          yAxisLabel="Time"
          xAxisLabel={capitalize(rest.groupingQuery) || 'Hourly'}
          labels={chartData.labels}
          datasets={chartData.data}
        />
      </div>
      <div className="chart-view">
        <Chart
          type="line"
          id="count"
          width={width}
          height={350}
          yAxisLabel="Number of events"
          unit={' '}
          isTime={false}
          xAxisLabel={capitalize(rest.groupingQuery) || 'Hourly'}
          labels={countChartData.labels}
          datasets={countChartData.data}
        />
      </div>
    </div>
  );

const viewSelector: Function = createSelector(
  [
    resourceSelector('slaperf'),
    (state: Object): Object => state.ui.settings,
  ], (meta: Object, settings: Object): Object => ({
    meta,
    collection: meta.data,
    settings,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.slaperf.fetchPerfData,
      fetch: actions.slaperf.fetchPerfData,
    }
  ),
  mapProps(({ params, ...rest }: Props): Props => ({
    id: params.id,
    params,
    ...rest,
  })),
  queryControl('minDate'),
  queryControl('maxDate'),
  queryControl('err'),
  queryControl('errDesc'),
  queryControl('producer'),
  queryControl('grouping'),
  queryControl('success'),
  queryControl(),
  mapProps(({
    minDateQuery,
    maxDateQuery,
    errQuery,
    errDescQuery,
    producerQuery,
    groupingQuery,
    successQuery,
    ...rest
  }: Props): Props => ({
    defaultDate: moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT),
    searchData: {
      minDate: minDateQuery,
      maxDate: maxDateQuery,
      err: errQuery,
      errDesc: errDescQuery,
      producer: producerQuery,
      grouping: groupingQuery,
      success: successQuery,
    },
    minDateQuery,
    maxDateQuery,
    errQuery,
    errDescQuery,
    producerQuery,
    groupingQuery,
    successQuery,
    ...rest,
  })),
  patch('load', [
    'id',
    'searchData',
  ]),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { searchData, fetch, id } = this.props;

      if (
        searchData.err !== nextProps.searchData.err ||
        searchData.errDesc !== nextProps.searchData.errDesc ||
        searchData.producer !== nextProps.searchData.producer ||
        searchData.minDate !== nextProps.searchData.minDate ||
        searchData.maxDate !== nextProps.searchData.maxDate ||
        searchData.grouping !== nextProps.searchData.grouping ||
        searchData.success !== nextProps.searchData.success
      ) {
        fetch(
          id,
          nextProps.searchData
        );
      }
    },
  }),
  mapProps(({ collection, groupingQuery, settings, ...rest }: Props): Props => ({
    chartData: createPerfLineDatasets(collection, groupingQuery || 'hourly'),
    countChartData: createPerfLineDatasets(collection, groupingQuery || 'hourly', true),
    collection,
    groupingQuery,
    width: settings.width - 230,
    settings,
    ...rest,
  })),
  pure([
    'settings',
    'collection',
    'minDateQuery',
    'maxDateQuery',
    'errQuery',
    'errDescQuery',
    'producerQuery',
    'groupingQuery',
    'successQuery',
    'location',
  ])
)(SLAPerf);
