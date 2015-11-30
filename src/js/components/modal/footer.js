import React, { Component, PropTypes } from 'react';


export default class Footer extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className='modal-footer'>
        {this.props.children}
      </div>
    );
  }
}
