import React, { Component, PropTypes } from 'react';

class UserInfo extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div id='user-info'>
        <button className='btn btn-inverse'>
          <i className='fa fa-user' />
          &nbsp;<span className='username'>{ currentUser.name }</span>
        </button>
      </div>
    );
  }
}


export default UserInfo;
