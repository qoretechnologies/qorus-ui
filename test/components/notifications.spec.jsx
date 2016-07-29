import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { NotificationList, Notification } from '../../src/js/components/notifications';

describe('{ NotificationList, Notification } from \'components/notifications\'', () => {
  it('Show different notification types', () => {
    const wrapper = mount(
      <NotificationList>
        <Notification type="success">Success</Notification>
        <Notification type="warning">Warning</Notification>
        <Notification type="error">Error</Notification>
      </NotificationList>
    );

    expect(wrapper.find('.notification').length).to.equals(3);
    expect(wrapper.find('.success').length).to.equals(1);
    expect(wrapper.find('.warning').length).to.equals(1);
    expect(wrapper.find('.error').length).to.equals(1);
  });

  it('Show only Notification items', () => {
    const wrapper = mount(
      <NotificationList>
        <Notification type="success">Notify</Notification>
        <div className="notification">some notification</div>
      </NotificationList>
    );

    expect(wrapper.find('.notification').length).to.equals(1);
  });
});
