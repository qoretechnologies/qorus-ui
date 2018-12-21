import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';

import AuditTable from './table';
import Box from '../../../components/box';

const orderSelector = (state, props) => props.order;

const selector = createSelector(
  [orderSelector],
  order => ({
    audits: order.AuditEvents,
    order,
  })
);

const AuditsView: Function = ({
  audits,
}: {
  audits: Array<Object>,
}): React.Element<Box> => (
  <Box top noPadding fill>
    <AuditTable audits={audits} />
  </Box>
);

export default compose(connect(selector))(AuditsView);
