import React, { Component, PropTypes } from 'react';

import { ALL_ORDER_STATES } from '../../../constants/orders';
import { Tbody, Tr, Td } from '../../../components/new_table';

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
    const { label } = ALL_ORDER_STATES.find(o => o.name === this.props.stepdata.status);

    return (
      <Tr onClick={this.handleRowClick}>
        <Td>
          {this.state.expand && (
            <i className="fa fa-minus-circle" />
          )}
          {!this.state.expand && (
            <i className="fa fa-plus-circle" />
          )}
        </Td>
        <Td>
            <span className={`label status-${label}`}>
              { status }
            </span>
        </Td>
        <Td className="name">{ name }</Td>
        <Td />
        <Td />
        <Td />
        <Td />
        <Td />
        <Td />
        <Td />
        <Td />
      </Tr>
    );
  }

  renderRows() {
    const count = this.props.stepdata.steps.length;

    if (!this.state.expand && count !== 1) return undefined;

    return this.props.stepdata.steps.map((step, index) => {
      const { label } = ALL_ORDER_STATES.find(o => o.name === step.stepstatus);

      return (
        <Tr key={index}>
          <Td>{ count === 1 ? '' : '|' }</Td>
          <Td>
            <span className={`label status-${label}`}>
              { step.stepstatus }
            </span>
          </Td>
          <Td className="name">{ step.stepname }</Td>
          <Td className="text">{ step.error_type }</Td>
          <Td className="text">{ step.custom_status }</Td>
          <Td>{ step.ind }</Td>
          <Td>{ step.retries }</Td>
          <Td>{ this.renderSkip(step.skip) }</Td>
          <Td>
            <Date date={step.started} />
          </Td>
          <Td>
            <Date date={step.completed} />
          </Td>
          <Td>{ step.subworkflow_instanceid }</Td>
        </Tr>
      );
    });
  }

  render() {
    return (
      <Tbody>
        { this.renderFirstRow() }
        { this.renderRows() }
      </Tbody>
    );
  }
}
