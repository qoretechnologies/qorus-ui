import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { mount, shallow as shallowEnzyme } from 'enzyme';
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
      expect(result.props.children.props.children[2]).to.equal('All');
    });

    it('renders dropdown item with title and icon', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Item
          title="All"
          icon="power-off"
        />
      );
      const result = renderer.getRenderOutput();

      expect(result.type).to.equal('li');
      expect(result.props.children.props.children[0].type).to.equal('i');
      expect(result.props.children.props.children[0].props.className).to.equal('fa fa-power-off');
      expect(result.props.children.props.children[2]).to.equal('All');
    });

    it('runs the provided action when clicked', () => {
      const action = chai.spy();
      const hideDropdown = () => true;
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Item
          action={action}
          hideDropdown={hideDropdown}
        />
      );
      const result = renderer.getRenderOutput();

      result.props.children.props.onClick({ preventDefault: () => {} });
      expect(action).to.have.been.called();
    });
  });

  describe('Dropdown', () => {
    describe('Single Dropdown', () => {
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

        dropdown.props.children[0][0].props.onClick({
          preventDefault: () => {},
          defaultPrevented: false,
        });

        dropdown = renderer.getRenderOutput();

        const comps = shallow.filterTree(dropdown, el => (
          el.type === Item
        ));

        expect(comps).to.have.length(2);
      });

      it('hides the Dropdown when Item is clicked', () => {
        const component = TestUtils.renderIntoDocument(
          <Dropdown>
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="Item"
            />
          </Dropdown>
        );

        const button = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        TestUtils.Simulate.click(button[0]);

        const item = TestUtils.scryRenderedDOMComponentsWithClass(component, 'dropdown-item');

        expect(component.state.showDropdown).to.equal(true);

        TestUtils.Simulate.click(item[0]);

        expect(component.state.showDropdown).to.equal(false);
      });

      it('marks the first item when dropdown is opened', () => {
        const wrapper = mount(
          <Dropdown show>
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="Item"
            />
            <Item
              action={() => true}
              title="Item two"
            />
          </Dropdown>
        );

        expect(wrapper.find(Item).first().props().marked).to.eql(true);
      });
    });

    describe('Multi select dropdown', () => {
      it('doesnt hide the Dropdown when Item is clicked', () => {
        const component = TestUtils.renderIntoDocument(
          <Dropdown
            multi
            def="All"
          >
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="All"
            />
            <Item
              action={() => true}
              title="Item"
            />
          </Dropdown>
        );

        const button = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        TestUtils.Simulate.click(button[0]);

        const item = TestUtils.scryRenderedDOMComponentsWithClass(component, 'dropdown-item');

        expect(component.state.showDropdown).to.equal(true);

        TestUtils.Simulate.click(item[0]);

        expect(component.state.showDropdown).to.equal(true);
      });

      it('runs the provided onSubmit function when submit button clicked', () => {
        const action = chai.spy();
        const component = TestUtils.renderIntoDocument(
          <Dropdown
            multi
            def="All"
            onSubmit={action}
          >
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="All"
            />
            <Item
              action={() => true}
              title="Item"
            />
            <Item
              action={() => true}
              title="Item two"
            />
          </Dropdown>
        );

        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        TestUtils.Simulate.click(buttons[0]);

        const item = TestUtils.scryRenderedDOMComponentsWithClass(component, 'dropdown-item');

        TestUtils.Simulate.click(item[1]);
        TestUtils.Simulate.click(item[2]);
        TestUtils.Simulate.click(buttons[1]);

        expect(action).to.have.been.called().with(['Item two', 'Item']);
      });

      it('remembers the selected items when closed', () => {
        const component = TestUtils.renderIntoDocument(
          <Dropdown
            multi
            def="All"
          >
            <Control>
              Click me
            </Control>
            <Item
              title="All"
            />
            <Item
              title="Item"
            />
            <Item
              title="Item two"
            />
          </Dropdown>
        );

        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        TestUtils.Simulate.click(buttons[0]);

        const items = TestUtils.scryRenderedDOMComponentsWithClass(component, 'dropdown-item');

        TestUtils.Simulate.click(items[1]);
        TestUtils.Simulate.click(items[2]);

        expect(component.state.selected).to.have.length(2);
        expect(component.state.selected[0]).to.equal('Item two');
        expect(component.state.selected[1]).to.equal('Item');

        TestUtils.Simulate.click(buttons[0]);

        expect(component.state.selected).to.have.length(2);

        TestUtils.Simulate.click(buttons[0]);

        expect(items[1].parentElement.className).to.equal('active');
        expect(items[2].parentElement.className).to.equal('active');
      });

      it('renders a submit button with "Filter" label when onSubmit func is provided', () => {
        const action = chai.spy();
        const component = TestUtils.renderIntoDocument(
          <Dropdown
            multi
            def="All"
            onSubmit={action}
          >
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="All"
            />
          </Dropdown>
        );

        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        expect(buttons[1].textContent).to.equal(' Filter');
      });

      it('renders a submit button with the provided label when onSubmit func is provided', () => {
        const action = chai.spy();
        const component = TestUtils.renderIntoDocument(
          <Dropdown
            multi
            def="All"
            onSubmit={action}
            submitLabel="Submit button"
          >
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="All"
            />
          </Dropdown>
        );

        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        expect(buttons[1].textContent).to.equal(' Submit button');
      });

      it('sets the control title to "Please select"', () => {
        const component = mount(
          <Dropdown
            multi
          >
            <Control />
          </Dropdown>
        );

        expect(component.find(Control).props().children).to.eql('Please select');
      });

      it('sets the control title to children', () => {
        const component = mount(
          <Dropdown
            multi
          >
            <Control>Click me</Control>
          </Dropdown>
        );

        expect(component.find(Control).props().children).to.eql('Click me');
      });

      it('selects the "All" item by default if def provided', () => {
        const component = TestUtils.renderIntoDocument(
          <Dropdown
            multi
            def="All"
          >
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="All"
            />
            <Item
              action={() => true}
              title="Item"
            />
          </Dropdown>
        );

        const button = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        TestUtils.Simulate.click(button[0]);

        const items = TestUtils.scryRenderedDOMComponentsWithClass(component, 'dropdown-item');

        expect(component.state.selected[0]).to.equal('All');
        expect(items[0].textContent).to.equal(' All');
        expect(items[0].parentElement.className).to.equal('active marked');
      });

      it('selects the clicked item and the default is deselected', () => {
        const component = TestUtils.renderIntoDocument(
          <Dropdown
            multi
            def="All"
          >
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="All"
            />
            <Item
              action={() => true}
              title="Item"
            />
          </Dropdown>
        );

        const button = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        TestUtils.Simulate.click(button[0]);

        const items = TestUtils.scryRenderedDOMComponentsWithClass(component, 'dropdown-item');

        TestUtils.Simulate.click(items[1]);

        expect(component.state.selected).to.have.length(1);
        expect(component.state.selected[0]).to.equal('Item');
      });

      it('deselects the clicked item and default is selected', () => {
        const component = TestUtils.renderIntoDocument(
          <Dropdown
            multi
            def="All"
          >
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="All"
            />
            <Item
              action={() => true}
              title="Item"
            />
          </Dropdown>
        );

        const button = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        TestUtils.Simulate.click(button[0]);

        const items = TestUtils.scryRenderedDOMComponentsWithClass(component, 'dropdown-item');

        TestUtils.Simulate.click(items[1]);
        TestUtils.Simulate.click(items[1]);

        expect(component.state.selected).to.have.length(1);
        expect(component.state.selected[0]).to.equal('All');
      });

      it('deselects others when default is clicked', () => {
        const component = TestUtils.renderIntoDocument(
          <Dropdown
            multi
            def="All"
          >
            <Control>
              Click me
            </Control>
            <Item
              action={() => true}
              title="All"
            />
            <Item
              action={() => true}
              title="Item"
            />
            <Item
              action={() => true}
              title="Item2"
            />
            <Item
              action={() => true}
              title="Item3"
            />
          </Dropdown>
        );

        const button = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        TestUtils.Simulate.click(button[0]);

        const items = TestUtils.scryRenderedDOMComponentsWithClass(component, 'dropdown-item');

        TestUtils.Simulate.click(items[1]);
        TestUtils.Simulate.click(items[2]);
        TestUtils.Simulate.click(items[3]);

        expect(component.state.selected).to.have.length(3);

        TestUtils.Simulate.click(items[0]);

        expect(component.state.selected).to.have.length(1);
        expect(component.state.selected[0]).to.equal('All');
      });
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
