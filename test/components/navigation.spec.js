// Mocking window and document object:
require('../testdom.js')('<html><body></body></html>');

const jsdom = require('mocha-jsdom');
const React = require('react/addons');
const chai = require('chai');
const expect = chai.expect;

describe('Testing Navigation Component', function () {
  jsdom({ skipWindowCheck: true });

  const Component = require('../../src/js/components/navigation.js');
  const TestUtils = React.addons.TestUtils;
  const props = {
    mainItems: [{
      url: '/workflows',
      name: 'Workflows',
      className: 'workflow',
      icon: 'icon-sitemap'
    }],
    extraItems: []
  };

  const nodeEl = TestUtils.renderIntoDocument(
    <Component {...props} />
  );

  const listNode = TestUtils.scryRenderedDOMComponentsWithTag(nodeEl, 'ul');
  const firstEl = listNode[0];

  it('main nav should contains 1 children', function () {
    expect(firstEl.getDOMNode().childNodes).to.have.length(1);
  });

  it('main nav first item should contain text: Workflows', function () {
    expect(firstEl.getDOMNode().firstChild.textContent.trim())
    .to.equal('Workflows');
  });

  it('main nav first item should have className: workflow', function () {
    expect(firstEl.getDOMNode().firstChild.className)
      .to.have.string('workflow');
  });

  it('main nav first icon should have className: icon-sitemap', function () {
    expect(firstEl.getDOMNode().getElementsByTagName('i')[0].className)
      .to.have.string('icon-sitemap');
  });
});
