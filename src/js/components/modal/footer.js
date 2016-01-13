import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


@pureRender
export default class Footer extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div className='modal-footer'>
        {this.props.children}
      </div>
    );
  }
}
