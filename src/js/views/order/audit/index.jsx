import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';

import AuditTable from './table';
import { sortTable } from 'helpers/table';
import Box from '../../../components/box';

const orderSelector = (state, props) => props.order;

const selector = createSelector([orderSelector], order => ({
  audits: order.AuditEvents,
  order,
}));

@compose(connect(selector))
export default class ErrorsView extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.object,
    audits: PropTypes.array,
    order: PropTypes.object,
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
    let audits = this.props.audits || [];

    audits = sortTable(audits, {
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
        onItemClick={this.handleItemClick}
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
