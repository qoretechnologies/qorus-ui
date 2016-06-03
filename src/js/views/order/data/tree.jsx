import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from 'store/api/actions';

import Tree from 'components/tree';
import Loader from 'components/loader';

const orderSelector = (state, props) => (
  state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ))
);

const selector = createSelector(
  [
    orderSelector,
  ], (order) => ({
    order,
  })
);

@connect(selector)
export default class TreeView extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.object,
    order: PropTypes.object,
    data: PropTypes.string,
  };

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(
      actions.orders.fetch({}, id)
    );
  }

  render() {
    if (!this.props.order) return <Loader />;

    return (
      <Tree data={this.props.order[this.props.data]} />
    );
  }
}
