// @flow
import React from 'react';

import StatsView from '../../views/workflows/detail/stats';
import { connect } from 'react-redux';
import NoDataIf from '../../components/NoDataIf';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Headbar from '../../components/Headbar';

const OrderStats = ({ orderStats }: Object): any => (
  <div>
    <Headbar>
      <Breadcrumbs>
        <Crumb active> Global order stats</Crumb>
      </Breadcrumbs>
    </Headbar>
    <Box top>
      <NoDataIf condition={!orderStats}>
        {() => <StatsView orderStats={orderStats} />}
      </NoDataIf>
    </Box>
  </div>
);

export default connect((state: Object) => ({
  orderStats: state.api.system.data.order_stats,
}))(OrderStats);
