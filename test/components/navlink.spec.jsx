import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import Nav, { NavLink } from '../../src/js/components/navlink';

/* class NavLinkWithContext extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string,
    path: PropTypes.string,
  };

  static childContextTypes = {
    route: PropTypes.object,
    params: PropTypes.object,
    routes: PropTypes.object,
    relativeLinks: PropTypes.object,
  };

  getChildContext() {
    return {
      relativeLinks: {
        params: {},
        route: {
          childRoutes: [],
          component: () => true,
          indexRoute: {
            onEnter: () => true,
            to: 'meh',
          },
          path: 'my/awesome/path',
        },
        routes: [],
      },
    };
  }

  render() {
    return (
      <NavLink {...this.props}>
        {this.props.children}
      </NavLink>
    );
  }
} */


describe("Nav, { NavLink } from 'components/navlink'", () => {
  describe('Nav', () => {
    it('renders the navigation wrapper', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Nav path="/my/awesome/path" />
      );

      const result = renderer.getRenderOutput();

      expect(result.type).to.equal('ul');
    });
  });

  describe('Nav with NavLink', () => {
    it('renders the navigation with 1 tab', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Nav path="/my/awesome/path">
          <NavLink to="/my/awesome/path">Awesome</NavLink>
        </Nav>
      );

      const result = renderer.getRenderOutput();

      expect(result.props.children[0].type).to.equal(NavLink);
      expect(result.props.children[0].props.children).to.equal('Awesome');
    });
  });
});
