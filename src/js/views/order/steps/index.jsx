import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import Row from './row';
import { groupInstances } from '../../../helpers/orders';
import checkNoData from '../../../hocomponents/check-no-data';

@compose(
  mapProps(({ order, ...rest }): Object => ({
    steps: order.StepInstances,
    order,
    ...rest,
  })),
  checkNoData(({ steps }) => steps && Object.keys(steps).length)
)
export default class StepsView extends Component {
  static propTypes = {
    steps: PropTypes.array,
    order: PropTypes.object,
  };

  renderTableBody() {
    const data = groupInstances(this.props.steps);

    return Object.keys(data).map((d, index) => (
        <Row stepdata={data[d]} key={index} />
      )
    );
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
              <th className="narrow">Status</th>
              <th className="narrow">Name</th>
              <th>Error Type</th>
              <th>Custom Status</th>
              <th className="narrow">Ind</th>
              <th className="narrow">Retries</th>
              <th className="narrow">Skip</th>
              <th>Started</th>
              <th>Completed</th>
              <th>SubWFL IID</th>
            </tr>
          </thead>
          { this.renderTableBody() }
        </table>
      </div>
    );
  }
}
