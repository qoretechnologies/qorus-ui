import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';


import { UserInfo } from '../../src/js/containers/user_info';


describe("UserInfo from 'containers/user_info'", () => {
  it("displays current user's name", () => {
    const wrapper = mount(
      <UserInfo user={{ name: 'jon.doe' }} />
    );
    expect(wrapper.find('button').text().trim()).to.equal('jon.doe');
  });

  it('No authentcation - no dropdown', () => {
    const wrapper = mount(
      <UserInfo
        user={{ name: 'jon.doe' }}
        noauth
      />
    );
    expect(wrapper.find('.user-dropdown').length).to.equal(0);
  });
});
