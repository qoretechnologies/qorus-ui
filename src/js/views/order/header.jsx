import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import OrderControls from '../workflow/tabs/list/controls';

import { pureRender } from 'components/utils';

@pureRender
export default class extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h3 className="detail-title pull-left">
            <Link
              to={`/workflow/${this.props.data.workflowid}/list/All`}
            >
              <i className="fa fa-angle-left" />
            </Link>
              {' '}
              {this.props.data.name}
            <small>
              {' '}
              {this.props.data.version}
              {' '}
              {`ID#${this.props.data.id}`}
            </small>
          </h3>
          <div className="order-actions pull-right">
            <OrderControls
              data={this.props.data}
              showText
            />
          </div>
        </div>
      </div>
    );
  }
}
