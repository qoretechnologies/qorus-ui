import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import * as shallow from '../shallow';


import Topbar from '../../src/js/components/topbar';
import UserInfo from '../../src/js/containers/user_info';


describe("Topbar from 'components/topbar'", () => {
  it('displays system info and logged in user', () => {
    const info = { 'instance-key': 'test-1' };
    const user = { username: 'jon.doe' };

    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Topbar info={info} currentUser={user} />
    );
    const result = renderer.getRenderOutput();

    const instanceEl = shallow.filterTree(result, el => (
      el.props.className &&
      el.props.className.split(/\s+/).indexOf('topbar__instance') >= 0
    ))[0];
    expect(instanceEl.props.children).to.eql('test-1');

    const userComp = shallow.filterTree(result, el => (
      el.type === UserInfo
    ))[0];
    expect(userComp.props.user).to.equal(user);
  });
});
