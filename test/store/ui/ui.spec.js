import { expect } from 'chai';
import ui from '../../../src/js/store/ui';
import * as actions from '../../../src/js/store/ui/actions';
import { statuses } from '../../../src/js/constants/notifications';

import { createStore } from 'redux';


describe.only('UI redux store', () => {
  let store;

  beforeEach(() => {
    store = createStore(ui);
  });

  it('returns the default state', () => {
    store.subscribe(() => {
      expect(store.getState().workflows).to.be.an('object');
      expect(store.getState().workflows.sortBy).to.equal('id');
      expect(store.getState().workflows.sortByKey.direction).to.equal(-1);
      expect(store.getState().workflows.historySortBy).to.equal('name');
      expect(store.getState().workflows.historySortByKey.direction).to.equal(1);
    });

    store.dispatch(
      actions.workflows.sort(
        { sortBy: 'id', sortByKey: { ignoreCase: true, direction: -1 } }
      )
    );
  });

  it('add notification', () => {
    store.subscribe(() => {
      const state = store.getState();
      const notificationList = state.notifications.list;
      expect(notificationList).to.be.instanceOf(Array);
      expect(notificationList.length).to.equals(1);
    });

    store.dispatch(
      actions.notifications.success('test')
    );
  });

  it('Newest notification at first', () => {
    store.dispatch(
      actions.notifications.error('something goes wrong')
    );

    store.subscribe(() => {
      const state = store.getState();
      const notificationList = state.notifications.list;

      expect(notificationList[0].type).to.equals(statuses.SUCCESS);
      expect(notificationList[1].type).to.equals(statuses.ERROR);
    });

    store.dispatch(
      actions.notifications.success('good news')
    );
  });

  Object.keys(statuses).forEach(item => {
    const name = item.toLowerCase();
    it(`add ${name} notification`, () => {
      store.subscribe(() => {
        const state = store.getState();
        const notificationList = state.notifications.list;
        const notification = notificationList[0];
        expect(notification.type).to.equals(item);
      });

      store.dispatch(
        actions.notifications[name]('test')
      );
    });
  });

  it('Delete notification', () => {
    store.dispatch(actions.notifications.success('1'));
    store.dispatch(actions.notifications.success('2'));
    store.dispatch(actions.notifications.success('3'));

    const state = store.getState();
    const notificationId = state.notifications.list[1].id;

    store.subscribe(() => {
      const updatedState = store.getState();
      const notificationList = updatedState.notifications.list;
      expect(notificationList.length).to.equals(2);
    });

    store.dispatch(
      actions.notifications.deleteNotification(notificationId)
    );
  });
});
