import React, { Component, PropTypes } from 'react';
import { pureRender } from './utils';
import UserInfo from './userInfo';

@pureRender
class Header extends Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
  };

  render() {
    const { info, currentUser } = this.props;

    return (
      <header id='header' className='navbar navbar-fixed-top navbar-inverse'>
        <div className='navbar-inner'>
          <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-8'>
                 <a className='menu-icon'><i className='icon-reorder'></i></a>
                  <h2 className='navbar-text'>
                  <span className='instance-key'>{ info['instance-key'] }</span>
                  </h2>
                </div>
                <div className='pull-right'>
                  <ul id='taskbar' className='taskbar'></ul>
                  <UserInfo currentUser={ currentUser }/>
                  <div id='notifications-icon'></div>
                </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
