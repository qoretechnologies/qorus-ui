import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import Box from '../../../components/box';
import AuditTable from './table';

const orderSelector = (state, props) => props.order;

const selector = createSelector([orderSelector], (order) => ({
  audits: order.AuditEvents,
  order,
}));

const AuditsView: Function = ({
  audits,
}: {
  audits: Array<Object>;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<Box> => (
  <Box top noPadding fill>
    <AuditTable audits={audits} />
  </Box>
);

export default compose(connect(selector))(AuditsView);
