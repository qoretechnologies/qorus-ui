import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';

import ErrorsTable from './table';
import Box from 'components/box';
import { sortTable } from 'helpers/table';
import csv from '../../../hocomponents/csv';

const orderSelector = (state, props) => props.order;

const transformErrors = order => {
  if (!order.ErrorInstances) return null;

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

const errorSelector = createSelector([orderSelector], order =>
  transformErrors(order)
);

const selector = createSelector(
  [errorSelector, orderSelector],
  (errors, order) => ({
    errors,
    steps: order.StepInstances,
    order,
  })
);

@compose(connect(selector))
@csv('errors', 'order_errors')
export default class ErrorsView extends Component {
  static propTypes = {
    errors: PropTypes.array,
    steps: PropTypes.array,
    order: PropTypes.object,
    onCSVClick: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      limit: 10,
    });
  }

  handleItemClick = (event, limit) => {
    this.setState({
      limit,
    });
  };

  renderTable() {
    let errors = this.props.errors || [];

    errors = sortTable(errors, {
      sortBy: 'created',
      sortByKey: {
        direction: -1,
      },
    });

    errors = errors.map((e, index) => {
      const copy = e;
      copy.id = index;

      return copy;
    });

    if (this.state.limit !== 'All') {
      errors = errors.slice(0, this.state.limit);
    }

    return (
      <ErrorsTable
        collection={errors}
        steps={this.props.steps}
        onItemClick={this.handleItemClick}
        onCSVClick={this.props.onCSVClick}
        limit={this.state.limit}
      />
    );
  }

  render() {
    return (
      <Box top noPadding>
        {this.renderTable()}
      </Box>
    );
  }
}
