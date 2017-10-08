// @flow
import React from 'react';
import lifecycle from 'recompose/lifecycle';
import capitalize from 'lodash/capitalize';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mapProps from 'recompose/mapProps';

import { resourceSelector } from '../../../../../selectors';
import actions from '../../../../../store/api/actions';
import patch from '../../../../../hocomponents/patchFuncArgs';
import sync from '../../../../../hocomponents/sync';
import Chart from '../../../../../components/chart';
import Container from '../../../../../components/container';
import { createPerfLineDatasets } from '../../../../../helpers/chart';

type Props = {
  params: Object,
  id: number,
  searchData: Object,
  sort: string,
  sortDir: string,
  offset: number,
  limit: number,
  canLoadMore: boolean,
  handleLoadMore: Function,
  chartData: Object,
  countChartData: Object,
  settings: Object,
  width: number,
  collection: Array<Object>,
  groupingQuery: string,
  successChartData: Object,
};

const PerfView: Function = ({
  chartData,
  countChartData,
  successChartData,
  width,
  ...rest
}: Props): React.Element<any> => (
  <Container>
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
        isNotTime
        xAxisLabel={capitalize(rest.groupingQuery) || 'Hourly'}
        labels={countChartData.labels}
        datasets={countChartData.data}
      />
    </div>
    <div className="chart-view">
      <Chart
        type="line"
        id="success"
        width={width}
        height={350}
        yAxisLabel="Percentage %"
        unit="%"
        isNotTime
        xAxisLabel={capitalize(rest.groupingQuery) || 'Hourly'}
        labels={successChartData.labels}
        datasets={successChartData.data}
      />
    </div>
  </Container>
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
    countChartData: createPerfLineDatasets(collection, groupingQuery || 'hourly', 'count'),
    successChartData: createPerfLineDatasets(collection, groupingQuery || 'hourly', 'success'),
    collection,
    groupingQuery,
    width: settings.width - 260,
    settings,
    ...rest,
  })),
)(PerfView);
