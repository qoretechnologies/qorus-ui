/* eslint no-unused-expressions: 0 */
import React from 'react';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { mount } from 'enzyme';

import { NotificationList, Notification } from '../../src/js/components/notifications';

chai.use(spies);

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

  it('Handle notification click', () => {
    const handleClick = chai.spy();

    const wrapper = mount(
      <Notification
        type="success"
        onClick={handleClick}
      >
        Success
      </Notification>
    );

    wrapper.find(Notification).simulate('click');

    expect(handleClick).to.have.been.called();
  });
});
