import React, { Component, PropTypes } from 'react';
import { pureRender } from '../utils';


@pureRender
export default class Groups extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element)
  };

  render() {
    return (
      <div>
        <h4>Groups</h4>
        {this.props.children}
      </div>
    );
  }
}
