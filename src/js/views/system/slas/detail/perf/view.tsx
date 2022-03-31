// @flow
import capitalize from 'lodash/capitalize';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import { createSelector } from 'reselect';
import Chart from '../../../../../components/chart';
import Flex from '../../../../../components/Flex';
import { createPerfLineDatasets } from '../../../../../helpers/chart';
import patch from '../../../../../hocomponents/patchFuncArgs';
import sync from '../../../../../hocomponents/sync';
import { resourceSelector } from '../../../../../selectors';
import actions from '../../../../../store/api/actions';

type Props = {
  params: Object;
  id: number;
  searchData: Object;
  sort: string;
  sortDir: string;
  offset: number;
  limit: number;
  canLoadMore: boolean;
  handleLoadMore: Function;
  chartData: Object;
  countChartData: Object;
  settings: Object;
  width: number;
  collection: Array<Object>;
  groupingQuery: string;
  successChartData: Object;
};

const PerfView: Function = ({
  chartData,
  countChartData,
  successChartData,
  width,
  ...rest
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <Flex display="initial" scrollY>
    <div className="chart-view">
      <Chart
        type="line"
        id="perf"
        width={width}
        height={350}
        yAxisLabel="Time"
        xAxisLabel={capitalize(rest.groupingQuery) || 'Hourly'}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'labels' does not exist on type 'Object'.
        labels={chartData.labels}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
        // @ts-ignore ts-migrate(2339) FIXME: Property 'labels' does not exist on type 'Object'.
        labels={countChartData.labels}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
        // @ts-ignore ts-migrate(2339) FIXME: Property 'labels' does not exist on type 'Object'.
        labels={successChartData.labels}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        datasets={successChartData.data}
      />
    </div>
  </Flex>
);

const viewSelector: Function = createSelector(
  // @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
  [resourceSelector('slaperf'), (state: Object): Object => state.ui.settings],
  (meta: Object, settings: Object): Object => ({
    meta,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    collection: meta.data,
    settings,
  })
);

export default compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'slaperf' does not exist on type '{}'.
    load: actions.slaperf.fetchPerfData,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'slaperf' does not exist on type '{}'.
    fetch: actions.slaperf.fetchPerfData,
  }),
  mapProps(
    ({ params, ...rest }: Props): Props => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      id: params.id,
      params,
      ...rest,
    })
  ),
  patch('load', ['id', 'searchData']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { searchData, fetch, id } = this.props;

      if (
        // @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
        searchData.err !== nextProps.searchData.err ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'errDesc' does not exist on type 'Object'... Remove this comment to see the full error message
        searchData.errDesc !== nextProps.searchData.errDesc ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'producer' does not exist on type 'Object... Remove this comment to see the full error message
        searchData.producer !== nextProps.searchData.producer ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'minDate' does not exist on type 'Object'... Remove this comment to see the full error message
        searchData.minDate !== nextProps.searchData.minDate ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'maxDate' does not exist on type 'Object'... Remove this comment to see the full error message
        searchData.maxDate !== nextProps.searchData.maxDate ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'grouping' does not exist on type 'Object... Remove this comment to see the full error message
        searchData.grouping !== nextProps.searchData.grouping ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'success' does not exist on type 'Object'... Remove this comment to see the full error message
        searchData.success !== nextProps.searchData.success
      ) {
        fetch(id, nextProps.searchData);
      }
    },
  }),
  mapProps(
    ({ collection, groupingQuery, settings, ...rest }: Props): Props => ({
      // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      chartData: createPerfLineDatasets(collection, groupingQuery || 'hourly'),
      countChartData: createPerfLineDatasets(collection, groupingQuery || 'hourly', 'count'),
      successChartData: createPerfLineDatasets(collection, groupingQuery || 'hourly', 'success'),
      collection,
      groupingQuery,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'width' does not exist on type 'Object'.
      width: settings.width - 260,
      settings,
      ...rest,
    })
  )
)(PerfView);
