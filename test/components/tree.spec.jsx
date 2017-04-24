import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Tree from '../../src/js/components/tree';
import { Controls } from '../../src/js/components/controls';

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

  it('renders the button with default text', () => {
    const renderer = TestUtils.createRenderer();

    renderer.render(
      <Tree data={data} />
    );

    const result = renderer.getRenderOutput();

    expect(result.props.children[0].type).to.equal('div');
    expect(result.props.children[0].props.className).to.equal('pull-right');
    expect(result.props.children[0].props.children.type).to.equal(Controls);
  });
});
