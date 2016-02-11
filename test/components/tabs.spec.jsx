import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Tabs, { Item, Pane } from '../../src/js/components/tabs';


describe("Tabs, { Item, Pane } from 'components/tabs'", () => {
  before(() => {
    chai.use(spies);
  });


  describe('Tabs', () => {
    it('displays tabbed navigation and tab contents based on child panes',
    () => {
      const comp = TestUtils.renderIntoDocument(
        <Tabs>
          <Pane name="Tab Pane" />
        </Tabs>
      );

      const nav = TestUtils.findRenderedDOMComponentWithTag(comp, 'ul');

      expect(Array.from(nav.classList)).to.include('nav');
      expect(nav.children).to.have.length(1);

      const item = TestUtils.findRenderedComponentWithType(comp, Item);

      expect(item.props.name).to.equal('Tab Pane');

      const pane = TestUtils.findRenderedComponentWithType(comp, Pane);

      expect(pane.props.children).to.equal(false);
    });


    it('uses pane slugs to create targeted navigation items', () => {
      const comp = TestUtils.renderIntoDocument(
        <Tabs>
          <Pane slug="first-tab" name="Tab Pane" />
        </Tabs>
      );

      const item = TestUtils.findRenderedComponentWithType(comp, Item);

      expect(item.props.slug).to.equal('first-tab');

      const pane = TestUtils.findRenderedComponentWithType(comp, Pane);

      expect(pane.props.slug).to.equal('first-tab');
    });


    it('automatically creates slug for tabs without one', () => {
      const comp = TestUtils.renderIntoDocument(
        <Tabs>
          <Pane name="Tab Pane" />
        </Tabs>
      );

      const item = TestUtils.findRenderedComponentWithType(comp, Item);

      expect(item.props.slug).to.equal('tab-pane');

      const pane = TestUtils.findRenderedComponentWithType(comp, Pane);

      expect(pane.props.slug).to.equal('tab-pane');
    });


    it('initially activates the first tab', () => {
      const comp = TestUtils.renderIntoDocument(
        <Tabs>
          <Pane name="Tab 1" />
          <Pane name="Tab 2" />
        </Tabs>
      );

      const items = TestUtils.scryRenderedComponentsWithType(comp, Item);

      expect(items[0].props.active).to.equal(true);
      expect(items[1].props.active).to.equal(false);

      const panes = TestUtils.scryRenderedComponentsWithType(comp, Pane);

      expect(panes[0].props.active).to.equal(true);
      expect(panes[1].props.active).to.equal(false);
    });


    it('sets initially active tab to `active` prop if set', () => {
      const comp = TestUtils.renderIntoDocument(
        <Tabs active="tab-2">
          <Pane name="Tab 1" />
          <Pane name="Tab 2" />
        </Tabs>
      );

      const items = TestUtils.scryRenderedComponentsWithType(comp, Item);

      expect(items[0].props.active).to.equal(false);
      expect(items[1].props.active).to.equal(true);

      const panes = TestUtils.scryRenderedComponentsWithType(comp, Pane);

      expect(panes[0].props.active).to.equal(false);
      expect(panes[1].props.active).to.equal(true);
    });


    it('changes active pane when clicked on navigation item', () => {
      const comp = TestUtils.renderIntoDocument(
        <Tabs>
          <Pane name="Tab 1" />
          <Pane name="Tab 2" />
        </Tabs>
      );

      const links = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');

      TestUtils.Simulate.click(links[1]);

      const items = TestUtils.scryRenderedComponentsWithType(comp, Item);

      expect(items[0].props.active).to.equal(false);
      expect(items[1].props.active).to.equal(true);

      const panes = TestUtils.scryRenderedComponentsWithType(comp, Pane);

      expect(panes[0].props.active).to.equal(false);
      expect(panes[1].props.active).to.equal(true);
    });


    it('calls `tabChange` prop with tab slug if set when clicked on ' +
       'navigation item but does not change active tab',
    () => {
      const spy = chai.spy();

      const comp = TestUtils.renderIntoDocument(
        <Tabs tabChange={spy}>
          <Pane name="Tab 1" />
          <Pane name="Tab 2" />
        </Tabs>
      );

      const links = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'a');

      TestUtils.Simulate.click(links[1]);

      expect(spy).to.have.been.called.with('tab-2');

      const items = TestUtils.scryRenderedComponentsWithType(comp, Item);

      expect(items[0].props.active).to.equal(true);
      expect(items[1].props.active).to.equal(false);

      const panes = TestUtils.scryRenderedComponentsWithType(comp, Pane);

      expect(panes[0].props.active).to.equal(true);
      expect(panes[1].props.active).to.equal(false);
    });
  });


  xdescribe('Item', () => {});


  xdescribe('Pane', () => {});
});
