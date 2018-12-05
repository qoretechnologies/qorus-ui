// @flow
import React from 'react';

import StatsView from '../../views/workflows/detail/stats';
import { connect } from 'react-redux';
import NoDataIf from '../../components/NoDataIf';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Headbar from '../../components/Headbar';
import Flex from '../../components/Flex';

const OrderStats = ({ orderStats }: Object): any => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active> Global order stats</Crumb>
      </Breadcrumbs>
    </Headbar>
    <Box top scrollY>
      <NoDataIf condition={!orderStats}>
        {() => <StatsView orderStats={orderStats} />}
      </NoDataIf>
    </Box>
  </Flex>
);

export default connect((state: Object) => ({
  orderStats: state.api.system.data.order_stats,
}))(OrderStats);
