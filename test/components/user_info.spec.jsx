import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import UserInfo from '../../src/js/components/user_info';


describe("UserInfo from 'components/user_info'", () => {
  it("displays current user's name", () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <UserInfo user={{ name: 'jon.doe' }} />
    );
    const result = renderer.getRenderOutput();

    expect(result.props.children[2].props.children).to.equal('jon.doe');
  });
});
