import React, { Component, PropTypes } from 'react';

import Date from 'components/date';

import { ORDER_STATES } from 'constants/orders';

export default class extends Component {
  static propTypes = {
    data: PropTypes.object,
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

  renderIcon(value) {
    if (value) {
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

    return this.props.data.children.map((h, index) => {
      const { label } = ORDER_STATES.find(o => o.name === h.workflowstatus);

      return (
        <tr key={index}>
          <td>|</td>
          <td>{ h.workflow_instanceid }</td>
          <td>{ h.name }</td>
          <td>
           <span className={`label label-${label}`}>
              { h.workflowstatus }
            </span>
          </td>
          <td>
            { this.renderIcon(h.business_error) }
          </td>
          <td>{ h.custom_status }</td>
          <td>{ h.custom_status_desc }</td>
          <td>{ h.error_count }</td>
          <td>{ h.priority }</td>
          <td>
            <Date date={h.scheduled} />
          </td>
          <td>
            { this.renderIcon(h.subworkflow) }
          </td>
          <td>{ h.synchronous }</td>
          <td>{ h.warning_count }</td>
          <td>
            <Date date={h.started} />
          </td>
          <td>
            <Date date={h.completed} />
          </td>
        </tr>
      );
    });
  }

  render() {
    const { ...data } = this.props.data;
    const { label } = ORDER_STATES.find(o => o.name === data.workflowstatus);

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
          <td>{ data.workflow_instanceid }</td>
          <td>{ data.name }</td>
          <td>
             <span className={`label label-${label}`}>
                { data.workflowstatus }
              </span>
          </td>
          <td>
            { this.renderIcon(data.business_error) }
          </td>
          <td>{ data.custom_status }</td>
          <td>{ data.custom_status_desc }</td>
          <td>{ data.error_count }</td>
          <td>{ data.priority }</td>
          <td>
            <Date date={data.scheduled} />
          </td>
          <td>
            { this.renderIcon(data.subworkflow) }
          </td>
          <td>{ data.synchronous }</td>
          <td>{ data.warning_count }</td>
          <td>
            <Date date={data.started} />
          </td>
          <td>
            <Date date={data.completed} />
          </td>
        </tr>
        { this.renderRows() }
      </tbody>
    );
  }
}
