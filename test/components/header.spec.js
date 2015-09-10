// Mocking window and document object:
require('../testdom.js')('<html><body></body></html>');

const jsdom = require('mocha-jsdom');
const React = require('react/addons');
const chai = require('chai');
const expect = chai.expect;

describe('Testing Header Component', function () {
  jsdom({ skipWindowCheck: true });

  it('should contain text: test-1!', function () {
    const Header = require('../../src/js/components/header.js');
    const TestUtils = React.addons.TestUtils;


    const myDiv = TestUtils.renderIntoDocument(
      <Header
        info={{ 'instance-key': 'test-1' }}
        currentUser={{ username: 'panda' }} />
    );

    const divText = TestUtils.findRenderedDOMComponentWithTag(myDiv, 'h2');

    expect(divText.getDOMNode().textContent).to.equal('test-1');
  });
});
