import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import UserInfo from '../../src/js/components/userInfo';


describe("UserInfo from 'components/userInfo'", function () {
  it("displays current user's name", function () {
    const comp = TestUtils.renderIntoDocument(
      <UserInfo user={{ name: 'jon.doe' }} />
    );

    const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');

    expect(el.textContent).to.equal(' jon.doe');
  });
});
