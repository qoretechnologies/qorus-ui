import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Row from './row';

import actions from 'store/api/actions';

const orderSelector = (state, props) => (
  state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ))
);

const selector = createSelector(
  [
    orderSelector,
  ], (order) => ({
    hierarchy: order.HierarchyInfo,
    order,
  })
);

@connect(selector)
export default class HierarchyView extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    hierarchy: PropTypes.object,
    order: PropTypes.object,
  };

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(
      actions.orders.fetch({}, id)
    );
  }

  groupHierarchy() {
    const groups = {};
    const { hierarchy } = this.props;

    Object.keys(this.props.hierarchy).forEach(h => {
      const id = hierarchy[h].subworkflow ?
        hierarchy[h].parent_workflow_instanceid : hierarchy[h].workflow_instanceid;
      const group = groups[id] = groups[id] || { children: [] };

      if (hierarchy[h].subworkflow) {
        group.children.push(hierarchy[h]);
      } else {
        Object.assign(group, hierarchy[h]);
      }
    });

    return groups;
  }

  renderRows() {
    const data = this.groupHierarchy();

    return Object.keys(data).map((h, index) => (
      <Row data={data[h]} key={index} />
    ));
  }

  render() {
    return (
      <div>
        <table
          className="table table-striped table-condensed table-hover table-fixed table--data"
        >
          <thead>
          <tr>
            <th className="narrow"></th>
            <th className="narrow"></th>
            <th>Workflow</th>
            <th className="narrow">Status</th>
            <th>Business Error</th>
            <th className="narrow">Custom Status</th>
            <th>Custom Status Description</th>
            <th className="narrow">Errors</th>
            <th className="narrow">Priority</th>
            <th>Scheduled</th>
            <th className="narrow">Subworkflow</th>
            <th className="narrow">Synchronous</th>
            <th className="narrow">Warnings</th>
            <th>Started</th>
            <th>Completed</th>
          </tr>
          </thead>
          { this.renderRows() }
        </table>
      </div>
    );
  }
}
