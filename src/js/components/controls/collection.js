import React, { Component, PropTypes } from 'react';
import { pureRender } from '../utils';


@pureRender
export default class Controls extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element)
  };

  render() {
    return (
      <div className='btn-controls'>
        {this.props.children}
      </div>
    );
  }
}
