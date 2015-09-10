// Mocking window and document object:
require('../testdom.js')('<html><body></body></html>');

const jsdom = require('mocha-jsdom');
const React = require('react/addons');
const chai = require('chai');
const expect = chai.expect;

describe('Testing Loader Component', function () {
  jsdom({ skipWindowCheck: true });

  it('should contain text: Loading!', function () {
    const Component = require('../../src/js/components/loader.js');
    const TestUtils = React.addons.TestUtils;


    const nodeEl = TestUtils.renderIntoDocument(
      <Component />
    );

    const divText = TestUtils.findRenderedDOMComponentWithTag(nodeEl, 'p');

    expect(divText.getDOMNode().textContent).to.equal(' Loading');
  });
});
