import React, { PropTypes } from 'react';
import Nav, { NavLink } from 'components/navlink';

import StaticView from './static';
import DynamicView from './dynamic';
import KeysView from './keys';

export default function DataView(props) {
  return (
    <div>
      <Nav
        path={ props.location.pathname }
        type="nav-pills"
      >
        <NavLink to="./static">Static</NavLink>
        <NavLink to="./dynamic">Dynamic</NavLink>
        <NavLink to="./keys">Keys</NavLink>
      </Nav>
      <div className="row tab-pane">
        <div className="col-xs-12">
          { props.children }
        </div>
      </div>
    </div>
  );
}

DataView.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
};

DataView.Static = StaticView;
DataView.Dynamic = DynamicView;
DataView.Keys = KeysView;
