import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';

import AuditTable from './table';
import Dropdown, { Control as DropdownToggle, Item as DropdownItem } from 'components/dropdown';
import { sortTable } from 'helpers/table';
import actions from 'store/api/actions';
import checkNoData from '../../../hocomponents/check-no-data';

const orderSelector = (state, props) => (
  state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ))
);

const selector = createSelector(
  [
    orderSelector,
  ], (order) => ({
    audits: order.AuditEvents,
    order,
  })
);

@compose(
  connect(
    selector,
    {
      fetch: actions.orders.fetch,
    }
  ),
  checkNoData((props) => props.audits && props.audits.length)
)
export default class ErrorsView extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.object,
    audits: PropTypes.array,
    order: PropTypes.object,
  };

  componentWillMount() {
    const { id } = this.props.params;

    this.props.fetch({}, id);

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
    console.log(this.props.audits);
    let audits = sortTable(this.props.audits, {
      sortBy: 'created',
      sortByKey: {
        direction: -1,
      },
    });

    audits = audits.map((a, index) => {
      const copy = a;
      copy.id = index;

      return copy;
    });

    if (this.state.limit !== 'All') {
      audits = audits.slice(0, this.state.limit);
    }

    return (
      <AuditTable
        collection={audits}
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
            </div>
          </div>
        </div>
        { this.renderTable() }
      </div>
    );
  }
}
