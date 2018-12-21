import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';

import ErrorsTable from './table';
import Box from 'components/box';
import csv from '../../../hocomponents/csv';

type ErrorsViewProps = {
  errors: Array<Object>,
  onCSVClick: Function,
};

const ErrorsView: Function = ({ errors, onCSVClick }: ErrorsViewProps) => (
  <Box top noPadding>
    <ErrorsTable errors={errors} onCSVClick={onCSVClick} />
  </Box>
);

const orderSelector = (state, props) => props.order;

const transformErrors = order => {
  if (!order.ErrorInstances) return [];

  return order.ErrorInstances.map((e, index) => {
    const copy = e;
    copy.id = index;
    copy.error_type = e.business_error ? 'Business' : 'Other';
    copy.step_name = order.StepInstances.find(
      s => s.stepid === e.stepid
    ).stepname;

    return copy;
  });
};

const errorSelector = createSelector(
  [orderSelector],
  order => transformErrors(order)
);

const selector = createSelector(
  [errorSelector, orderSelector],
  (errors, order) => ({
    errors,
    steps: order.StepInstances,
    order,
  })
);

export default compose(
  connect(selector),
  csv('errors', 'order_errors')
)(ErrorsView);
