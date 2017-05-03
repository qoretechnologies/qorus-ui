import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Tree from '../../src/js/components/tree';

const data = {
  account: {
    user: {
      name: {
        first: 'Miky',
        last: 'Snurka',
      },
      address: {
        city: 'Ostrava',
      },
      age: 150,
    },
    admin: 'someone',
  },
  value: 'value',
};

describe("Tree from 'components/tree'", () => {
  it('renders the tree view based on the data provided', () => {
    const comp = TestUtils.renderIntoDocument(
      <Tree data={data} />
    );

    const expands = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'expand');
    const spans = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'span');
    const treeTop = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'tree-top');

    expect(expands).to.have.length(1);
    expect(spans).to.have.length(2);
    expect(treeTop).to.have.length(2);
  });

  it('expands the tree on click', () => {
    const wrapper = mount(
      <Tree data={data} />
    );

    wrapper.find('.expand').first().simulate('click');

    expect(wrapper.find('.clps')).to.have.length(1);
    expect(wrapper.find('.expand')).to.have.length(1);
    expect(wrapper.find('span')).to.have.length(4);
    expect(wrapper.find('.tree-top')).to.have.length(2);
  });

  it('collapses the tree on click', () => {
    const wrapper = mount(
      <Tree data={data} />
    );

    wrapper.find('.expand').first().simulate('click');
    wrapper.find('.clps').first().simulate('click');

    expect(wrapper.find('.expand')).to.have.length(1);
    expect(wrapper.find('span')).to.have.length(2);
    expect(wrapper.find('.tree-top')).to.have.length(2);
  });

  it('does not render controls', () => {
    const wrapper = mount(
      <Tree data={data} noControls />
    );

    expect(wrapper.find('.pull-right')).to.have.length(0);
  });

  it('renders the expand/collapse buttons', () => {
    const wrapper = mount(
      <Tree data={data} />
    );

    expect(wrapper.find('.btn-group')).to.have.length(2);
  });

  it('renders simple data without the expand controlas and padding', () => {
    const wrapper = mount(
      <Tree data={{ a: 'b', c: 'd' }} />
    );

    expect(wrapper.find('.btn-group')).to.have.length(1);
    expect(wrapper.find('.nopad')).to.have.length(2);
  });

  it('expands all top data when expand all is clicked', () => {
    const wrapper = mount(
      <Tree data={data} />
    );

    wrapper.find('.button--expand').first().simulate('click');

    expect(wrapper.find('.clps')).to.have.length(1);
    expect(wrapper.find('.expand')).to.have.length(1);
    expect(wrapper.find('span')).to.have.length(4);
    expect(wrapper.find('.tree-top')).to.have.length(2);
  });

  it('collapses all top data when collapse all is clicked', () => {
    const wrapper = mount(
      <Tree data={data} />
    );

    wrapper.find('.button--collapse').first().simulate('click');

    expect(wrapper.find('.expand')).to.have.length(1);
    expect(wrapper.find('span')).to.have.length(2);
    expect(wrapper.find('.tree-top')).to.have.length(2);
  });
});
