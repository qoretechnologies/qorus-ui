// Mocking window and document object:
require('../testdom.js')('<html><body></body></html>');

const jsdom = require('mocha-jsdom');
const React = require('react/addons');
const chai = require('chai');
const expect = chai.expect;

describe('Testing Footer Component', function () {
  jsdom({ skipWindowCheck: true });

  const Component = require('../../src/js/components/footer.js');
  const TestUtils = React.addons.TestUtils;
  const props = {
    info: {
      'omq-schema': 'test@test',
      'omq-version': '1',
      'omq-build': 'test'
    }
  };

  const testComponent = TestUtils.renderIntoDocument(
    <Component {...props} />
  );

  const el = TestUtils.scryRenderedDOMComponentsWithTag(testComponent, 'small');

  it('<small> schema should be (Schema: test@test)', function () {
    expect(el[0].getDOMNode().textContent).to.equal('(Schema: test@test)');
  });

  it('<small> version should be 1.test', function () {
    expect(el[1].getDOMNode().textContent).to.equal('(Version: 1.test)');
  });

});
