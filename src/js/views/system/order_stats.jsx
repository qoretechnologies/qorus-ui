// @flow
import React from 'react';

import StatsView from '../../views/workflows/detail/stats';
import { connect } from 'react-redux';
import NoData from '../../components/nodata';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';

const OrderStats = ({ orderStats }: Object): any => (
  <div>
    <Breadcrumbs>
      <Crumb> Global order stats</Crumb>
    </Breadcrumbs>
    <Box top>
      {orderStats ? <StatsView orderStats={orderStats} /> : <NoData />}
    </Box>
  </div>
);

export default connect((state: Object) => ({
  orderStats: state.api.system.data.order_stats,
}))(OrderStats);
