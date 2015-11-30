import React, { Component, PropTypes } from 'react';


export default class Body extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className='modal-body'>
        {this.props.children}
      </div>
    );
  }
}
