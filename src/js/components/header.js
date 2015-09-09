import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
class Header extends Component {
  render () {
    let { info } = this.props;

    info = info || {};

    return (
      <header id="header" className="navbar navbar-fixed-top navbar-inverse">
        <div className="navbar-inner">
          <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                 <a className="menu-icon"><i className="icon-reorder"></i></a>
                 <h2 className="navbar-text"><span className="instance-key">{ info['instance-key'] }</span></h2>
                </div>
                <div className="pull-right">
                  <ul id="taskbar" className="taskbar"></ul>
                  <div id="user-info"></div>
                  <div id="notifications-icon"></div>
                </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
