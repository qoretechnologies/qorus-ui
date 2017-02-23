import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import Tree from '../../src/js/components/tree';
import { Control } from '../../src/js/components/controls';

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

    expect(expands).to.have.length(4);
    expect(spans).to.have.length(10);
    expect(treeTop).to.have.length(2);
    expect(spans[0].textContent).to.equal('account:');
    expect(spans[1].textContent).to.equal('user:');
    expect(spans[2].textContent).to.equal('name:');
    expect(spans[3].textContent).to.equal('first:');
    expect(spans[4].textContent).to.equal('last:');
    expect(spans[5].textContent).to.equal('address:');
    expect(spans[6].textContent).to.equal('city:');
    expect(spans[7].textContent).to.equal('age:');
    expect(spans[8].textContent).to.equal('admin:');
    expect(spans[9].textContent).to.equal('value:');
  });

  it('renders the button with default text', () => {
    const renderer = TestUtils.createRenderer();

    renderer.render(
      <Tree data={data} />
    );

    const result = renderer.getRenderOutput();

    expect(result.props.children[0].type).to.equal('div');
    expect(result.props.children[0].props.className).to.equal('pull-right');
    expect(result.props.children[0].props.children.type).to.equal(Control);
    expect(result.props.children[0].props.children.props.label).to.equal('Copy view');
  });

  it('renders the the textarea when button is clicked', () => {
    const renderer = TestUtils.createRenderer();

    renderer.render(
      <Tree data={data} />
    );

    let result = renderer.getRenderOutput();

    result.props.children[0].props.children.props.action();

    result = renderer.getRenderOutput();

    expect(result.props.children[2].type).to.equal('textarea');
  });
});
