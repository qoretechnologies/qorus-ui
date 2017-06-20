/* eslint no-unused-expressions: 0 */
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Search from '../../src/js/components/search';
import { Control } from '../../src/js/components/controls';

describe("Search from 'components/search'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Search', () => {
    it('renders search input with icon', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Search />
      );

      const result = renderer.getRenderOutput();

      expect(result.type).to.equal('form');
      expect(result.props.children.type).to.equal('div');
      expect(result.props.children.props.children[0]).to.equal.null;
      expect(result.props.children.props.children[1].type).to.equal('input');
      expect(result.props.children.props.children[2].type).to.equal('div');
      expect(result.props.children.props.children[2].props.children[0].type).to.equal(Control);
      expect(result.props.children.props.children[2].props.children[1].type).to.equal(Control);
    });

    it('renders the input with a default value', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Search
          defaultValue="Yolo"
        />
      );

      const result = renderer.getRenderOutput();

      expect(result.props.children.props.children[1].props.value).to.equal('Yolo');
    });

    it('runs the provided function when the input changes after 500ms', () => {
      const action = chai.spy();
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Search
          onSearchUpdate={action}
        />
      );
      const result = renderer.getRenderOutput();

      result.props.children.props.children[1].props.onChange({
        target: { value: 'Hello' },
        persist: () => true,
      });

      setTimeout(() => {
        expect(action).to.have.been.called().with('Hello');
      }, 500);
    });

    it('runs the provided function when the form is submitted', () => {
      const action = chai.spy();

      const wrapper = mount(
        <Search
          onSearchUpdate={action}
        />
      );

      wrapper.find('input').first().props().onChange({
        target: { value: 'Hello' },
        persist: () => true,
      });

      wrapper.find('form').first().props().onSubmit({ preventDefault: () => true });

      expect(action).to.have.been.called().with('Hello');
    });

    it('sets the value to empty when clear button is clicked', () => {
      const action = chai.spy();
      const wrapper = mount(
        <Search
          onSearchUpdate={action}
          defaultValue="Hello"
        />
      );

      expect(wrapper.find('input').first().props().value).to.eql('Hello');

      wrapper.find('button').first().simulate('click');

      expect(wrapper.find('input').first().props().value).to.eql('');
      expect(action).to.have.been.called().with('');
    });

    it('renders the input wrapper without the pull-right class', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Search
          pullLeft
        />
      );

      const result = renderer.getRenderOutput();

      expect(result.props.className).to.equal('col-sm-3 ');
    });

    it('renders a history button if the searches are provided', () => {
      const wrapper = mount(
        <Search
          defaultValue="test"
          onSearchUpdate={() => true}
          searches={[
            'kek',
            'topkek',
          ]}
        />
      );

      expect(wrapper.find('button')).to.have.length(3);
    });

    it('renders the dropdown with values when searches match the input value', () => {
      const wrapper = mount(
        <Search
          defaultValue="test"
          onSearchUpdate={() => true}
          searches={[
            'kek',
            'topkek',
          ]}
        />
      );

      wrapper.find('input').simulate('change', {
        target: { value: 'top' },
        persist: () => true,
      });

      expect(wrapper.find('li')).to.have.length(1);

      wrapper.find('input').simulate('change', {
        target: { value: 'ke' },
        persist: () => true,
      });

      expect(wrapper.find('li')).to.have.length(2);
    });

    it('does not render the dropdown when values are identical or no matches found', () => {
      const wrapper = mount(
        <Search
          defaultValue="test"
          onSearchUpdate={() => true}
          searches={[
            'kek',
            'topkek',
          ]}
        />
      );

      wrapper.find('input').simulate('change', {
        target: { value: 'topkeke' },
        persist: () => true,
      });

      expect(wrapper.find('li')).to.have.length(0);

      wrapper.find('input').simulate('change', {
        target: { value: 'kek' },
        persist: () => true,
      });

      expect(wrapper.find('li')).to.have.length(1);
    });

    it('hides the dropdown and inserts the value when a dropdown item is clicked', () => {
      const wrapper = mount(
        <Search
          defaultValue="test"
          onSearchUpdate={() => true}
          searches={[
            'kek',
            'topkek',
          ]}
        />
      );

      wrapper.find('input').simulate('change', {
        target: { value: 'top' },
        persist: () => true,
      });

      wrapper.find('.dropdown-menu span').first().simulate('click');

      expect(wrapper.find('input').props().value).to.eql('topkek');
      expect(wrapper.find('.dropdown-menu')).to.have.length(0);
    });
  });
});
