require('../testdom.js')('<html><body></body></html>');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import jsdom from 'mocha-jsdom';
import { expect } from 'chai';

import { Group, Groups } from '../../src/js/components/groups';


// XXX Discuss this style as it is definitely different from other specs.
describe("'components/groups'", () => {
  jsdom({ skipWindowCheck: true });

  describe('Group', () => {
    it('displays group names as an info label', () => {
      const comp = TestUtils.renderIntoDocument(
        <Group name='Test Group' />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'a');

      expect(el.textContent.trim()).to.equal('Test Group');
      expect(Array.from(el.firstChild.classList)).to.contain('label-info');
    });

    it('optionally displays group size', () => {
      const comp = TestUtils.renderIntoDocument(
        <Group name='Test Group' size={0} />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'a');

      expect(el.textContent.replace(/\s+/g, ' ').trim()).
        to.equal('Test Group (0)');
    });

    it('hides disabled group', () => {
      const comp = TestUtils.renderIntoDocument(
        <Group name='Test Group' disabled={true} />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'a');

      expect(Array.from(el.firstChild.classList)).
        not.to.include('label-info');
    });

    it('links to group detail', () => {
      const comp = TestUtils.renderIntoDocument(
        <Group name='Test Group' url='/test-group' />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'a');

      expect(el.href).to.equal('/test-group');
    });
  });

  describe('Groups', () => {
    it('conveniently groups Group instances together', () => {
      const comp = TestUtils.renderIntoDocument(
        <Groups>
          <Group name='Test Group 1' />
          <Group name='Test Group 2' />
        </Groups>
      );

      const comps = TestUtils.scryRenderedComponentsWithType(comp, Group);

      expect(comps).to.have.length(2);
    });
  });
});
