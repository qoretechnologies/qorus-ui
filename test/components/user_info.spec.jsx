import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import UserInfo from '../../src/js/components/user_info';


describe("UserInfo from 'components/user_info'", () => {
  it("displays current user's name", () => {
    const comp = TestUtils.renderIntoDocument(
      <UserInfo user={{ name: 'jon.doe' }} />
    );

    const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');

    expect(el.textContent).to.equal(' jon.doe');
  });
});
