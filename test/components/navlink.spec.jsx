import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import NavLink from '../../src/js/components/navlink';

class NavLinkWithContext extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
  }

  static childContextTypes = {
    router: React.PropTypes.object,
  }

  getChildContext() {
    return {
      router: {
        isActive: p => (p === 'http://example.com/success'),
        push: p => p,
        replace: p => p,
        go: p => p,
        goBack: p => p,
        goForward: p => p,
        setRouteLeaveHook: p => p,
        createHref: p => p,
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

describe("NavLink from 'components/navlink'", () => {
  before(() => {
    chai.use(spies);
  });

  it('renders list element with a tag with href="http://example.com/" and text equals "Go to mainpage"', () => {
    const comp = TestUtils.renderIntoDocument(
      <NavLinkWithContext to="http://example.com/">
        Go to mainpage
      </NavLinkWithContext>
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'li');

    expect(els[0].childNodes[0].textContent).to.equal('Go to mainpage');
    expect(els[0].childNodes[0].href).to.equal('http://example.com/');
  });

  it('should have className="active"', () => {
    const comp = TestUtils.renderIntoDocument(
      <NavLinkWithContext to="http://example.com/success">
        Go to mainpage
      </NavLinkWithContext>
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'li');

    expect(els[0].childNodes[0].className).to.equal('active');
  });
});
