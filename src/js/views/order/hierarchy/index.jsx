import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import Row from './row';
import checkNoData from '../../../hocomponents/check-no-data';

@compose(
  mapProps(({ order, ...rest }) => ({
    hierarchy: order.HierarchyInfo,
    order,
    ...rest,
  })),
  checkNoData(({ hierarchy }) => hierarchy && Object.keys(hierarchy).length)
)
export default class HierarchyView extends Component {
  static propTypes = {
    hierarchy: PropTypes.object,
    order: PropTypes.object,
    compact: PropTypes.bool,
  };

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
      <Row data={data[h]} key={index} compact={this.props.compact} />
    ));
  }

  render() {
    const { compact } = this.props;

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
            { !compact && (
              <th>Custom Status Description</th>
            )}
            <th className="narrow">Errors</th>
            <th className="narrow">Priority</th>
            { !compact && (
              <th>Scheduled</th>
            )}
            { !compact && (
              <th className="narrow">Subworkflow</th>
            )}
            { !compact && (
              <th className="narrow">Synchronous</th>
            )}
            { !compact && (
              <th className="narrow">Warnings</th>
            )}
            { !compact && (
              <th>Started</th>
            )}
            <th>Completed</th>
          </tr>
          </thead>
          { this.renderRows() }
        </table>
      </div>
    );
  }
}
