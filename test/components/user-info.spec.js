require('../testdom.js')('<html><body></body></html>');

import jsdom from 'mocha-jsdom';
import { expect } from 'chai';
import React from 'react';

describe('Testing UserInfo Component', function () {
  jsdom({ skipWindowCheck: true });

  it('should contain text: temnoregg', function () {
    const Component = require('../../src/js/components/user-info.js');
    const TestUtils = React.addons.TestUtils;

    const comp = TestUtils.renderIntoDocument(
      <Component currentUser={{ name: 'temnoregg' }} />
    );

    const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');

    expect(el.getDOMNode().textContent.trim()).to.equal('temnoregg');
  });
});
