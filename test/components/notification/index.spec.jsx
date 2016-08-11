import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import NotificationPanel from '../../../src/js/components/notifications';

chai.use(spies);

describe('Notification from \'components/notifications\'', () => {
  const rootEl = document.querySelector('#test-app');

  it('no alerts', () => {
    const wrapper = mount(<NotificationPanel />);
    expect(wrapper.find('Badge')).to.have.length(0);
  });

  it('render 4 alerts', () => {
    const notificationList = [{
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
    }, {
      type: 'GROUP',
      id: -2,
      alerttype: 'TRANSIENT',
      when: '2016-08-05 19:30:03.283602 +06:00',
      local: true,
      alert: 'INTERFACE-GROUP-DISABLED',
      alertid: 7,
      reason: 'external API call',
      who: 'admin',
      source: 'ipv6[::1]:64878 listener: ipv6[::]:8001',
      object: 'GROUP fs (-2)',
      instance: 'qorus-test-instance',
      name: 'fs',
      auditid: null,
    }];

    const alerts = {
      data: notificationList,
    };

    const wrapper = mount(<NotificationPanel {...{ alerts }} />);

    expect(wrapper.find('Badge')).to.have.length(1);

    const badgeProps = wrapper.find('Badge').first().props();
    expect(badgeProps.val).to.be.equals('4');
  });

  it('open panel', () => {
    const wrapper = mount(<NotificationPanel />);
    wrapper.find('.notification-button').simulate('click');

    expect(wrapper.find('.notification-list')).to.have.length(1);
  });

  it('hide on second click', done => {
    const wrapper = mount(<NotificationPanel />);

    wrapper.find('.notification-button').simulate('click');
    wrapper.find('.notification-button').simulate('click');

    setTimeout(() => {
      expect(wrapper.find('.notification-list')).to.have.length(0);
      done();
    }, 2000);
  });

  it('hide on other element click', () => {
    const wrapper = mount(
      <NotificationPanel />,
      {
        attachTo: rootEl,
      }
    );
    wrapper.find('.notification-button').simulate('click');

    const event = document.createEvent('Event');
    event.initEvent('click', true, true);
    event.memo = {};

    const el = document.querySelector('body');
    el.dispatchEvent(event);
    expect(wrapper.state().isOpen).to.be.false();
  });

  it('do not hide on inner element click', () => {
    const wrapper = mount(
      <NotificationPanel />,
      {
        attachTo: rootEl,
      }
    );
    wrapper.find('.notification-button').simulate('click');

    const event = document.createEvent('Event');
    event.initEvent('click', true, true);
    event.memo = {};

    const el = document.querySelector('.notification-list');
    el.dispatchEvent(event);
    expect(wrapper.find('.notification-list')).to.have.length(1);
  });

  it('only ongoing list', () => {
    const notificationList = [{
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
    const alerts = {
      data: notificationList,
    };

    const wrapper = mount(<NotificationPanel {...{ alerts }} />);

    wrapper.find('.notification-button').simulate('click');

    expect(wrapper.find('.ongoing')).to.have.length(1);
    expect(wrapper.find('.transient')).to.have.length(0);
  });

  it('only transient list', () => {
    const notificationList = [{
      type: 'GROUP',
      id: -2,
      alerttype: 'TRANSIENT',
      when: '2016-08-05 19:30:03.283602 +06:00',
      local: true,
      alert: 'INTERFACE-GROUP-DISABLED',
      alertid: 7,
      reason: 'external API call',
      who: 'admin',
      source: 'ipv6[::1]:64878 listener: ipv6[::]:8001',
      object: 'GROUP fs (-2)',
      instance: 'qorus-test-instance',
      name: 'fs',
      auditid: null,
    }];
    const alerts = { data: notificationList };

    const wrapper = mount(<NotificationPanel {...{ alerts }} />);

    wrapper.find('.notification-button').simulate('click');

    expect(wrapper.find('.ongoing')).to.have.length(0);
    expect(wrapper.find('.transient')).to.have.length(1);
  });

  it('no notifications', () => {
    const notificationList = [];
    const alerts = { data: notificationList };

    const wrapper = mount(<NotificationPanel {...{ alerts }} />);

    wrapper.find('.notification-button').simulate('click');

    expect(wrapper.find('.ongoing')).to.have.length(0);
    expect(wrapper.find('.transient')).to.have.length(0);
    expect(wrapper.find('.no-notifications')).to.have.length(1);
  });
});
