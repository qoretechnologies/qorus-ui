import React, { Component, PropTypes } from 'react';
import { pureRender } from '../utils';


@pureRender
export default class Groups extends Component {
  render() {
    return (
      <div>
        <h4>Groups</h4>
        {this.props.children}
      </div>
    );
  }
}
