import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Dropdown, { Item, Control } from '../../src/js/components/dropdown';


describe("Dropdown, { Item, Control } from 'components/dropdown'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Item', () => {
    it('renders dropdown item with title', () => {
      const item = TestUtils.renderIntoDocument(
        <Item title="All" />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(item, 'li');

      expect(el.textContent).to.equal('All');
    });

    xit('handles action on click', () => {
      const action = chai.spy();
      const control = TestUtils.renderIntoDocument(
        <Control icon="refresh" action={action} />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');
      TestUtils.Simulate.click(el);

      expect(action).to.have.been.called();
    });
  });

  describe('Dropdown', () => {
    it('shows Item list when Control is clicked', () => {
      const dropdown = TestUtils.renderIntoDocument(
        <Dropdown>
          <Control>
            <i className="fa fa-square-o check-all checker"/>&nbsp;
          </Control>
          <Item title="Hello"/>
          <Item title="Its me"/>
        </Dropdown>
      );

      const btn = TestUtils.findRenderedDOMComponentWithTag(dropdown, 'button');

      TestUtils.Simulate.click(btn);

      const comps = TestUtils.scryRenderedComponentsWithType(dropdown, Item);

      expect(comps).to.have.length(2);
    });
  });

  describe('Control', () => {
    it('renders toggle button', () => {
      const control = TestUtils.renderIntoDocument(
        <Control>
          Click me
        </Control>
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(control, 'button');

      expect(el.firstChild.textContent).to.equal('Click me');
      expect(Array.from(el.lastChild.classList)).to.include('fa-caret-down');
    });
  });
});
