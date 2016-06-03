import React, { Component, PropTypes } from 'react';
import Nav, { NavLink } from 'components/navlink';

import StaticView from './static';
import DynamicView from './dynamic';
import KeysView from './keys';

export default class DataView extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  render() {
    return (
      <div>
        <Nav
          path={this.props.location.pathname}
          type="nav-pills"
        >
          <NavLink to="./static">Static</NavLink>
          <NavLink to="./dynamic">Dynamic</NavLink>
          <NavLink to="./keys">Keys</NavLink>
        </Nav>
        <div className="row tab-pane">
          <div className="col-xs-12">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}

DataView.Static = StaticView;
DataView.Dynamic = DynamicView;
DataView.Keys = KeysView;
