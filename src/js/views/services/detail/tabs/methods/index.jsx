import React, { Component, PropTypes } from 'react';
import MethodsTable from './table';


import { pureRender } from 'components/utils';
import actions from 'store/api/actions';


@pureRender
export default class MethodsTab extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  render() {
    return (
      <div>
        <div className="svc__methods">
          <MethodsTable service={this.props.service} />
        </div>
      </div>
    );
  }
}
