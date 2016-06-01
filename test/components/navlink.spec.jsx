import React, { Component, PropTypes } from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import Nav, { NavLink } from '../../src/js/components/navlink';

class NavLinkWithContext extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
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
}


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

    it('renders the navigation with 2 tabs, the first is active', () => {
      const comp = TestUtils.renderIntoDocument(
        <Nav path="/my/awesome/path">
          <NavLinkWithContext to="/my/awesome/path">Awesome</NavLinkWithContext>
          <NavLinkWithContext to="/my/another/path">Another</NavLinkWithContext>
        </Nav>
      );

      const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'li');

      expect(els[0].className).to.equal('active');
      expect(els[1].className).to.not.equal('active');
    });

    it('renders the navigation with 2 tabs, and 2 deeper tabs resulting in 2 active tabs for the one url', () => {
      const comp = TestUtils.renderIntoDocument(
        <Nav path="/my/awesome/path/deep/">
          <NavLinkWithContext to="/my/awesome/path">Awesome</NavLinkWithContext>
          <NavLinkWithContext to="/my/another/path">Another</NavLinkWithContext>
          <Nav path="/my/awesome/path/deep/">
            <NavLinkWithContext to="/my/awesome/path/deep">Awesome deep</NavLinkWithContext>
            <NavLinkWithContext to="/my/another/path/deep">Another deep</NavLinkWithContext>
          </Nav>
        </Nav>
      );

      const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'li');

      expect(els[0].className).to.equal('active');
      expect(els[1].className).to.not.equal('active');
      expect(els[2].className).to.equal('active');
      expect(els[3].className).to.not.equal('active');
    });
  });
});
