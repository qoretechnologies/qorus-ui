import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import { Route, Router } from 'react-router';
import Navigation from '../../src/js/components/navigation';


describe("Navigation from 'components/navigation'", () => {
  it('renders main and extra navigation lists', () => {
    const comp = TestUtils.renderIntoDocument(
      <Navigation />
    );

    const main =
      TestUtils.findRenderedDOMComponentWithClass(comp, 'side-menu__main');
    expect(main.tagName).to.equal('UL');

    const extra =
      TestUtils.findRenderedDOMComponentWithClass(comp, 'side-menu__extra');
    expect(extra.tagName).to.equal('UL');
  });


  it('renders main navigation items from mainItems prop', () => {
    const Nav = () => (
      <Navigation
        mainItems={[
          { url: '/workflows', name: 'Workflows' },
          { url: '/services', name: 'Services' }
        ]}
      />
    );

    const comp = TestUtils.renderIntoDocument(
      <Router>
        <Route path='/' component={Nav} />
      </Router>
    );

    const main =
      TestUtils.findRenderedDOMComponentWithClass(comp, 'side-menu__main');
    expect(main.children).to.have.length(2);

    expect(main.children[0].textContent).to.equal('Workflows');
    expect(main.children[0].firstElementChild.href).
      to.equal('about:blank#/workflows');

    expect(main.children[1].textContent).to.equal('Services');
    expect(main.children[1].firstElementChild.href).
      to.equal('about:blank#/services');
  });


  it('renders extra navigation items from extraItems prop', () => {
    const Nav = () => (
      <Navigation
        extraItems={[
          { url: '/', name: 'Special' }
        ]}
      />
    );

    const comp = TestUtils.renderIntoDocument(
      <Router>
        <Route path='/' component={Nav} />
      </Router>
    );

    const extra =
      TestUtils.findRenderedDOMComponentWithClass(comp, 'side-menu__extra');
    expect(extra.children).to.have.length(1);

    expect(extra.children[0].textContent).to.equal('Special');
    expect(extra.children[0].firstElementChild.href).
      to.equal('about:blank#/');
  });


  it('optionally renders navigation items with icons', () => {
    const comp = TestUtils.renderIntoDocument(
      <Navigation
        mainItems={[
          { url: '/workflows', name: 'Workflows', icon: 'fa-sitemap' }
        ]}
      />
    );

    const main =
      TestUtils.findRenderedDOMComponentWithClass(comp, 'side-menu__main');

    expect(Array.from(main.children[0].querySelector('i.fa').classList)).
      to.contain('fa-sitemap');
  });  
});
