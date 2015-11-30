import React, { Component, PropTypes } from 'react';


export default class Content extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render() {
    return (
      <div className='modal-content'>
        {this.props.children}
      </div>
    );
  }
}
