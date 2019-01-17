// @flow
import React from 'react';

import { connect } from 'react-redux';
import OrderStats from '../../components/OrderStats';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Headbar from '../../components/Headbar';
import Flex from '../../components/Flex';

const OrderStatsView = ({ orderStats }: Object): any => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active> Global order stats</Crumb>
      </Breadcrumbs>
    </Headbar>
    <OrderStats orderStats={orderStats} />
  </Flex>
);

export default connect((state: Object) => ({
  orderStats: state.api.system.data.order_stats,
}))(OrderStatsView);
