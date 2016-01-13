import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


@pureRender
export default class Header extends Component {
  static propTypes = {
    titleId: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    children: PropTypes.node
  };

  componentWillMount() {
    this.onClose = this.props.onClose && this.props.onClose.bind(this);
  }

  componentWillUpdate(nextProps) {
    this.onClose = nextProps.onClose && nextProps.onClose.bind(this);
  }

  render() {
    return (
      <div className='modal-header'>
        {this.props.onClose && (
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-label='Close'
            onClick={this.onClose}
          >
            <span aria-hidden='true'>&times;</span>
          </button>
        )}
        {this.props.children && (
          <h4 className='modal-title' id={this.props.titleId}>
            {this.props.children}
          </h4>
        )}
      </div>
    );
  }
}
