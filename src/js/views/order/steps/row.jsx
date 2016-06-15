import React, { Component, PropTypes } from 'react';

import { ORDER_STATES } from 'constants/orders';

import Date from 'components/date';

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

  renderFirstRow() {
    if (this.props.stepdata.steps.length === 1) return undefined;

    const { name, status } = this.props.stepdata;
    const { label } = ORDER_STATES.find(o => o.name === this.props.stepdata.status);

    return (
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
        <td>{ name }</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }

  renderRows() {
    const count = this.props.stepdata.steps.length;

    if (!this.state.expand && count !== 1) return undefined;

    return this.props.stepdata.steps.map((step, index) => {
      const { label } = ORDER_STATES.find(o => o.name === step.stepstatus);

      return (
        <tr key={index}>
          <td>{ count === 1 ? '' : '|' }</td>
          <td>
            <span className={`label label-${label}`}>
              { step.stepstatus }
            </span>
          </td>
          <td>{ step.stepname }</td>
          <td>{ step.error_type }</td>
          <td>{ step.custom_status }</td>
          <td>{ step.ind }</td>
          <td>{ step.retries }</td>
          <td>{ this.renderSkip(step.skip) }</td>
          <td>
            <Date date={step.started} />
          </td>
          <td>
            <Date date={step.completed} />
          </td>
          <td>{ step.subworkflow_instanceid }</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <tbody>
        { this.renderFirstRow() }
        { this.renderRows() }
      </tbody>
    );
  }
}
