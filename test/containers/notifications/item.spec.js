import React from 'react';
import { mount } from 'enzyme';

import { NotificationItem } from '../../../src/js/containers/notifications/item';

describe('{ NotificationItem } from \'containers/notifications/item\'', () => {
  it('delete after timeout', done => {
    const deleteNotification = () => done();
    const notification = {
      id: 'test',
      type: 'SUCCESS',
      message: 'test',
    };
    const timeout = 100;

    mount(
      <NotificationItem
        {...{ timeout, notification, deleteNotification }}
      />
    );
  });
});
