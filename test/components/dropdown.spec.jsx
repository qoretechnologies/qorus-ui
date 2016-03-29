import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import * as shallow from '../shallow';

import Dropdown, { Item, Control } from '../../src/js/components/dropdown';


describe("Dropdown, { Item, Control } from 'components/dropdown'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Item', () => {
    it('renders dropdown item with title', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Item title="All" />
      );
      const result = renderer.getRenderOutput();

      expect(result.type).to.equal('li');
      expect(result.props.children.props.children).to.equal('All');
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
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Dropdown>
          <Control>
            <i className="fa fa-square-o check-all checker" />&nbsp;
          </Control>
          <Item title="Hello" />
          <Item title="Its me" />
        </Dropdown>
      );
      let dropdown = renderer.getRenderOutput();

      dropdown.props.children[0][0].props.onClick();

      dropdown = renderer.getRenderOutput();

      const comps = shallow.filterTree(dropdown, el => (
        el.type === Item
      ));

      expect(comps).to.have.length(2);
    });
  });

  describe('Control', () => {
    it('renders toggle button', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Control>
          Click me
        </Control>
      );
      const result = renderer.getRenderOutput();

      expect(result.type).to.equal('button');
      expect(result.props.children[0]).to.equal('Click me');
      expect(result.props.children[2].props.className).to.equal(
        'fa fa-caret-down'
      );
    });
  });
});
