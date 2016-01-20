import React, { Component, PropTypes } from 'react';
import { pureRender } from './utils';


@pureRender
export default class UserInfo extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };


  render() {
    return (
      <button
        type='button'
        className='btn btn-inverse navbar-btn navbar-right'
      >
        <i className='fa fa-user' />
        {' '}
        <span>{this.props.user.name}</span>
      </button>
    );
  }
}
