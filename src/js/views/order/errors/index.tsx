import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import includes from 'lodash/includes';

import ErrorsTable from './table';
import csv from '../../../hocomponents/csv';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type ErrorsViewProps = {
  errors: Array<Object>,
  onCSVClick: Function,
  compact?: boolean,
  handleFilterChange: Function,
  tableId: string,
};

const ErrorsView: Function = ({
  errors,
  onCSVClick,
  compact,
  handleFilterChange,
  tableId,
}: ErrorsViewProps) => (
  <ErrorsTable
    compact={compact}
    errors={errors}
    onCSVClick={onCSVClick}
    onFilterChange={handleFilterChange}
    tableId={tableId}
  />
);

const orderSelector = (state, props) => props.order;
const filterSelector = (state, props) => props.errorFilter;
const stepIdSelector = (state, props) => props.filterByStepId;

const transformErrors = (order, filter, stepId) => {
  if (!order.ErrorInstances) return [];

  const res = order.ErrorInstances.map((e, index) => {
    const copy = e;
    copy.id = index;
    copy.error_type = e.business_error ? 'Business' : 'Other';
    copy.step_name = order.StepInstances.find(
      s => s.stepid === e.stepid
    )?.stepname;

    return copy;
  }).filter(d => includes(filter, d.severity) || includes(filter, 'ALL'));

  if (stepId) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
    return res.filter((errInst: Object) => errInst.stepid === stepId);
  }

  return res;
};

const errorSelector = createSelector(
  [orderSelector, filterSelector, stepIdSelector],
  (order, filter, stepId) => transformErrors(order, filter, stepId)
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
  withState('errorFilter', 'changeErrorFilter', ['ALL']),
  withHandlers({
    handleFilterChange: ({
      changeErrorFilter,
    }: {
      changeErrorFilter: Function,
    }): Function => (name: string): void => {
      changeErrorFilter(() => name);
    },
  }),
  connect(selector),
  csv('errors', 'order_errors'),
  onlyUpdateForKeys(['errors', 'compact', 'errorFilter', 'tableId'])
)(ErrorsView);
