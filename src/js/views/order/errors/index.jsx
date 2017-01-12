import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';

import ErrorsTable from './table';
import { Control as Button } from 'components/controls';
import Dropdown, { Control as DropdownToggle, Item as DropdownItem } from 'components/dropdown';
import CSVModal from './csv';
import { sortTable, generateCSV } from 'helpers/table';
import checkNoData from '../../../hocomponents/check-no-data';

const orderSelector = (state, props) => props.order;

const transformErrors = order => {
  if (!order.ErrorInstances) return null;

  return order.ErrorInstances.map((e, index) => {
    const copy = e;
    copy.id = index;
    copy.error_type = e.business_error ? 'Business' : 'Other';
    copy.step_name = order.StepInstances.find(s => s.stepid === e.stepid).stepname;

    return copy;
  });
};

const errorSelector = createSelector(
  [
    orderSelector,
  ], (order) => transformErrors(order)
);

const selector = createSelector(
  [
    errorSelector,
    orderSelector,
  ], (errors, order) => ({
    errors,
    steps: order.StepInstances,
    order,
  })
);

@compose(
  connect(selector),
  checkNoData((props) => props.errors && props.errors.length)
)
export default class ErrorsView extends Component {
  static propTypes = {
    errors: PropTypes.array,
    steps: PropTypes.array,
    order: PropTypes.object,
  };

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    selectModalText: PropTypes.func,
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

  handleCSVClick = () => {
    this._modal = (
      <CSVModal
        onMount={this.context.selectModalText}
        onClose={this.handleModalCloseClick}
        data={generateCSV(this.props.errors, 'order_errors')}
      />
    );

    this.context.openModal(this._modal);
  };

  handleModalCloseClick = () => {
    this.context.closeModal(this._modal);
  };

  renderTable() {
    let errors = sortTable(this.props.errors, {
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
      />
    );
  }

  render() {
    return (
      <div>
        <div className="col-xs-3 pull-right">
          <div className="input-group">
            <input
              className="form-control"
              readOnly
              value="Showing:"
            />
            <div className="input-group-btn">
              <Dropdown id="show">
                <DropdownToggle>
                  {this.state.limit}
                </DropdownToggle>
                <DropdownItem
                  title="10"
                  action={this.handleItemClick}
                />
                <DropdownItem
                  title="25"
                  action={this.handleItemClick}
                />
                <DropdownItem
                  title="50"
                  action={this.handleItemClick}
                />
                <DropdownItem
                  title="100"
                  action={this.handleItemClick}
                />
                <DropdownItem
                  title="500"
                  action={this.handleItemClick}
                />
                <DropdownItem
                  title="1000"
                  action={this.handleItemClick}
                />
                <DropdownItem
                  title="All"
                  action={this.handleItemClick}
                />
              </Dropdown>
              <Button
                label="CSV"
                big
                btnStyle="default"
                action={this.handleCSVClick}
              />
            </div>
          </div>
        </div>
        { this.renderTable() }
      </div>
    );
  }
}
