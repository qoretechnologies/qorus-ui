// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Flex from '../../components/Flex';
import Headbar from '../../components/Headbar';
import OrderStats from '../../components/OrderStats';

// @ts-ignore ts-migrate(2339) FIXME: Property 'orderStats' does not exist on type 'Obje... Remove this comment to see the full error message
const OrderStatsView = ({ orderStats }: any): any => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active> Global order stats</Crumb>
      </Breadcrumbs>
    </Headbar>
    <OrderStats orderStats={orderStats} />
  </Flex>
);

export default connect((state: any) => ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  orderStats: state.api.system.data.order_stats,
}))(OrderStatsView);
