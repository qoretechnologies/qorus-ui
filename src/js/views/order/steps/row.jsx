import React, { Component, PropTypes } from 'react';

import { ORDER_STATES } from 'constants/orders';

import moment from 'moment';

export default class extends Component {
  static propTypes = {
    stepdata: PropTypes.object,
  };

  componentWillMount() {
    this.setState({
      expand: false,
    });
  }

  handleRowClick = () => {
    this.setState({
      expand: !this.state.expand,
    });
  };

  renderSkip(skip) {
    if (skip) {
      return (
        <i className="fa fa-minus-circle icon-danger" />
      );
    }

    return (
      <i className="fa fa-check-circle icon-success" />
    );
  }

  renderRows() {
    if (!this.state.expand) return undefined;

    return this.props.stepdata.steps.map((step, index) => {
      const { label } = ORDER_STATES.find(o => o.name === step.stepstatus);
      const started = moment(step.started).isValid() ?
        moment(step.started).format('YYYY-MM-DD HH:mm:ss') : '';
      const completed = moment(step.completed).isValid() ?
        moment(step.completed).format('YYYY-MM-DD HH:mm:ss') : '';

      return (
        <tr key={index}>
          <td>|</td>
          <td>
            <span className={`label label-${label}`}>
              { step.stepstatus }
            </span>
          </td>
          <td> { step.stepname } </td>
          <td> { step.error_type } </td>
          <td> { step.custom_status } </td>
          <td> { step.ind } </td>
          <td> { step.retries } </td>
          <td> { this.renderSkip(step.skip) } </td>
          <td> { started } </td>
          <td> { completed } </td>
          <td> { step.subworkflow_instanceid } </td>
        </tr>
      );
    });
  }

  render() {
    const { name, status } = this.props.stepdata;
    const { label } = ORDER_STATES.find(o => o.name === this.props.stepdata.status);

    return (
      <tbody>
        <tr onClick={this.handleRowClick}>
          <td>
            {this.state.expand && (
              <i className="fa fa-minus-circle" />
            )}
            {!this.state.expand && (
              <i className="fa fa-plus-circle" />
            )}
          </td>
          <td>
            <span className={`label label-${label}`}>
              { status }
            </span>
          </td>
          <td> { name } </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        {this.renderRows()}
      </tbody>
    );
  }
}
