import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import UserInfo from '../../src/js/components/userInfo.js';


describe('Testing UserInfo Component', function () {
  it('should contain text: temnoregg', function () {
    const comp = TestUtils.renderIntoDocument(
      <UserInfo currentUser={{ name: 'temnoregg' }} />
    );

    const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');

    expect(el.textContent.trim()).to.equal('temnoregg');
  });
});
