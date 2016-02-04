import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import Topbar from '../../src/js/components/topbar';
import UserInfo from '../../src/js/components/userInfo';


describe("Topbar from 'components/topbar'", () => {
  it('displays system info and logged in user', () => {
    const info = { 'instance-key': 'test-1' };
    const user = { username: 'jon.doe' };

    const comp = TestUtils.renderIntoDocument(
      <Topbar info={info} currentUser={user} />
    );

    const instanceEl =
      TestUtils.findRenderedDOMComponentWithClass(comp, 'topbar__instance');
    expect(instanceEl.textContent).to.equal('test-1');

    const userComp = TestUtils.findRenderedComponentWithType(comp, UserInfo);
    expect(userComp.props.user).to.equal(user);
  });
});
