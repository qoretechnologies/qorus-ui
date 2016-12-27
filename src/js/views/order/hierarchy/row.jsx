import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Date from 'components/date';
import { ORDER_STATES } from '../../../constants/orders';

export default class extends Component {
  static propTypes = {
    data: PropTypes.object,
    compact: PropTypes.bool,
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

    const { compact } = this.props;

    return this.props.data.children.map((h, index) => {
      const { label } = ORDER_STATES.find(o => o.name === h.workflowstatus);

      return (
        <tr key={index}>
          <td>|</td>
          <td>
            <Link to={`/order/${h.workflow_instanceid}/all`}>
              { h.workflow_instanceid }
            </Link>
          </td>
          <td className="name"> -
            {' '}
            <Link to={`/workflow/${h.workflowid}/list/All/all`}>
              { h.name }
            </Link></td>
          <td>
           <span className={`label status-${label}`}>
              { h.workflowstatus }
            </span>
          </td>
          <td>
            { this.renderIcon(h.business_error) }
          </td>
          <td className="text">{ h.custom_status }</td>
          { !compact && (
            <td className="text">{ h.custom_status_desc }</td>
          )}
          <td>{ h.error_count }</td>
          <td>{ h.priority }</td>
          { !compact && (
            <td>
              <Date date={h.scheduled} />
            </td>
          )}
          { !compact && (
            <td>
              { this.renderIcon(h.subworkflow) }
            </td>
          )}
          { !compact && (
            <td>{ h.synchronous }</td>
          )}
          { !compact && (
            <td>{ h.warning_count }</td>
          )}
          { !compact && (
            <td>
              <Date date={h.started} />
            </td>
          )}
          <td>
            <Date date={h.completed} />
          </td>
        </tr>
      );
    });
  }

  render() {
    const { ...data } = this.props.data;
    const { compact } = this.props;
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
          <td>
            <Link to={`/order/${data.workflow_instanceid}/all`}>
              { data.workflow_instanceid }
            </Link>
          </td>
          <td className="name">
            <Link to={`/workflow/${data.workflowid}/list/All/all`}>
              { data.name }
            </Link>
          </td>
          <td>
             <span className={`label status-${label}`}>
                { data.workflowstatus }
              </span>
          </td>
          <td>
            { this.renderIcon(data.business_error) }
          </td>
          <td className="text">{ data.custom_status }</td>
          { !compact && (
            <td className="text">{ data.custom_status_desc }</td>
          )}
          <td>{ data.error_count }</td>
          <td>{ data.priority }</td>
          { !compact && (
            <td>
              <Date date={data.scheduled} />
            </td>
          )}
          { !compact && (
            <td>
              { this.renderIcon(data.subworkflow) }
            </td>
          )}
          { !compact && (
            <td>{ data.synchronous }</td>
          )}
          { !compact && (
            <td>{ data.warning_count }</td>
          )}
          { !compact && (
            <td>
              <Date date={data.started} />
            </td>
          )}
          <td>
            <Date date={data.completed} />
          </td>
        </tr>
        { this.renderRows() }
      </tbody>
    );
  }
}
