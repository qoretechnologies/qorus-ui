import React from 'react';
import Nav, { NavLink } from 'components/navlink';

import StaticView from './static';
import DynamicView from './dynamic';
import KeysView from './keys';

type Props = {
  location: Object,
  order: Object,
  children: any,
};

const DataView = ({ location, order, children }: Props) => (
  <div>
    <Nav
      path={ location.pathname }
      type="nav-pills"
    >
      <NavLink to="./static">Static</NavLink>
      <NavLink to="./dynamic">Dynamic</NavLink>
      <NavLink to="./keys">Keys</NavLink>
    </Nav>
    <div className="row tab-pane">
      <div className="col-xs-12">
        {React.cloneElement(
          children,
          {
            createElement: (Comp, props) => (
              <Comp
                {...{
                  ...props,
                  order,
                }}
              />
            ),
          }
        )}
      </div>
    </div>
  </div>
);

export default DataView;

export {
  StaticView,
  DynamicView,
  KeysView,
};
