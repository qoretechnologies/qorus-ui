import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import NotificationList from '../../../src/js/components/notifications/list';

chai.use(spies);

describe('NotificationList form \'components/notifications/list\'', () => {
  const notifications = [{
    type: 'GROUP',
    id: -3,
    alerttype: 'ONGOING',
    when: '2016-08-05 19:29:01.231166 +06:00',
    local: true,
    alert: 'INTERFACE-GROUP-DISABLED',
    alertid: 2,
    reason: 'external API call',
    who: 'admin',
    source: 'ipv6[::1]:64878 listener: ipv6[::]:8001',
    object: 'GROUP info (-3)',
    instance: 'qorus-test-instance',
    name: 'info',
    auditid: null,
  }, {
    type: 'GROUP',
    id: -6,
    alerttype: 'ONGOING',
    when: '2016-08-05 19:29:49.811845 +06:00',
    local: true,
    alert: 'INTERFACE-GROUP-DISABLED',
    alertid: 3,
    reason: 'external API call',
    who: 'admin',
    source: 'ipv6[::1]:64890 listener: ipv6[::]:8001',
    object: 'GROUP queue (-6)',
    instance: 'qorus-test-instance',
    name: 'queue',
    auditid: null,
  }, {
    type: 'GROUP',
    id: -8,
    alerttype: 'ONGOING',
    when: '2016-08-05 19:29:57.977416 +06:00',
    local: true,
    alert: 'INTERFACE-GROUP-DISABLED',
    alertid: 6,
    reason: 'external API call',
    who: 'admin',
    source: 'ipv6[::1]:64878 listener: ipv6[::]:8001',
    object: 'GROUP sqlutil (-8)',
    instance: 'qorus-test-instance',
    name: 'sqlutil',
    auditid: null,
  }];

  it('Show notifications', () => {
    const wrapper = mount(
      <NotificationList
        type="ONGOING"
        title="ongoing"
        notifications={notifications}
      />
    );

    expect(wrapper.find('.notification')).to.have.length(3);
  });

  it('Clear notifications', () => {
    const clearNotifications = chai.spy();

    const wrapper = mount(
      <NotificationList
        type="ONGOING"
        title="ongoing"
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    );

    wrapper.find('.clear-button').simulate('click');

    expect(clearNotifications).to.have.been.called();
  });
});
