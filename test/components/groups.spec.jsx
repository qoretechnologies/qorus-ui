import React from 'react';
import { Link } from 'react-router';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import * as shallow from '../shallow';


import { Group, Groups } from '../../src/js/components/groups';


describe("{ Group, Groups } from 'components/groups'", () => {
  describe('Group', () => {
    it('displays group names as an info label', () => {
      const comp = TestUtils.renderIntoDocument(
        <Group name="Test Group" />
      );

      const el = TestUtils.findRenderedDOMComponentWithClass(comp, 'group');

      expect(el.textContent.trim()).to.equal('Test Group');
      expect(Array.from(el.firstChild.classList)).to.contain('label-info');
    });

    it('optionally displays group size', () => {
      const comp = TestUtils.renderIntoDocument(
        <Group name="Test Group" size={0} />
      );

      const el = TestUtils.findRenderedDOMComponentWithClass(comp, 'group');

      expect(el.textContent.replace(/\s+/g, ' ').trim()).
        to.equal('Test Group (0)');
    });

    it('hides disabled group', () => {
      const comp = TestUtils.renderIntoDocument(
        <Group name="Test Group" disabled />
      );

      const el = TestUtils.findRenderedDOMComponentWithClass(comp, 'group');

      expect(Array.from(el.firstChild.classList)).not.to.include('label-info');
    });

    it('links to group detail', () => {
      const comp = TestUtils.renderIntoDocument(
        <Group name="Test Group" url="/test-group" />
      );

      const linkComp = TestUtils.findRenderedComponentWithType(comp, Link);

      expect(linkComp.props.to).to.equal('/test-group');
    });
  });

  describe('Groups', () => {
    it('conveniently groups Group instances together', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Groups>
          <Group name="Test Group 1" />
          <Group name="Test Group 2" />
        </Groups>
      );
      const result = renderer.getRenderOutput();

      const comps = shallow.filterTree(result, el => (
        el.type === Group
      ));

      expect(comps).to.have.length(2);
    });
  });
});
