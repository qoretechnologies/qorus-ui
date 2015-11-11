import React, { Component } from 'react';
import { pureRender } from '../utils';


@pureRender
export default class Controls extends Component {
  render() {
    return (
      <div className='btn-controls'>
        {this.props.children}
      </div>
    );
  }
};
