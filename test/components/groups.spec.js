require('../testdom.js')('<html><body></body></html>');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import jsdom from 'mocha-jsdom';
import { expect } from 'chai';

import GroupsView from '../../src/js/components/groups';


// XXX Discuss this style as it is definitely different from other specs.
describe("GroupsView from 'components/groups'", () => {
  jsdom({ skipWindowCheck: true });

  it('displays group names and sizes', () => {
    const groups = [
      { name: 'Test Group 1', size: 0, url: '#', enabled: true },
      { name: 'Test Group 2', size: 42, url: '#', enabled: true }
    ];
    const comp = TestUtils.renderIntoDocument(
      <GroupsView groups={ groups } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');

    expect(els[0].textContent.replace(/\s+/g, ' ').trim()).
      to.equal('Test Group 1 (0)');
    expect(els[1].textContent.replace(/\s+/g, ' ').trim()).
      to.equal('Test Group 2 (42)');
  });

  it('highlights enabled group', () => {
    const groups = [
      { name: 'Test Group', size: 0, url: '#', enabled: true }
    ];
    const comp = TestUtils.renderIntoDocument(
      <GroupsView groups={ groups } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');

    expect(els[0].firstElementChild.className.split(/\s+/g)).
      to.include('label-info');
  });

  it('hides disabled group', () => {
    const groups = [
      { name: 'Test Group', size: 0, url: '#', enabled: false }
    ];
    const comp = TestUtils.renderIntoDocument(
      <GroupsView groups={ groups } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');

    expect(els[0].firstElementChild.className.split(/\s+/g)).
      not.to.include('label-info');
  });

  it('links to group detail', () => {
    const groups = [
      { name: 'Test Group', size: 0, url: '/test-group', enabled: false }
    ];
    const comp = TestUtils.renderIntoDocument(
      <GroupsView groups={ groups } />
    );

    const els = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');

    expect(els[0].href).to.equal('/test-group');
  });
});
