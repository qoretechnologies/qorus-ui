// Mocking window and document object:
require('../testdom.js')('<html><body></body></html>');

var jsdom = require('mocha-jsdom');
var React = require('react/addons');
var chai = require('chai');
var expect = chai.expect;

describe('Testing Header Component', function() {
  jsdom({ skipWindowCheck: true });

  it('should contain text: test-1!', function() {
    var Header = require('../../src/js/components/header.js');
    var TestUtils = React.addons.TestUtils;


    var myDiv = TestUtils.renderIntoDocument(
      <Header info={{ 'instance-key': 'test-1' }} />
    );

    var divText = TestUtils.findRenderedDOMComponentWithTag(myDiv, 'h2');

    expect(divText.getDOMNode().textContent).to.equal('test-1');
  });
});
