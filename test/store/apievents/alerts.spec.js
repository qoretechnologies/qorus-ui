import { expect } from 'chai';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import api from '../../../src/js/store/api';
import * as events from '../../../src/js/store/apievents/actions';
import * as actions from '../../../src/js/store/api/resources/alerts/actions';

const raiseAlert = (store, type) => {
  store.dispatch(
    events.message('test', JSON.stringify([{
      eventstr: `ALERT_${type}_RAISED`,
      time: '1990-01-01 00:00:00',
      info: {
        alert: `TEST-${type}`,
        name: `TEST-${type}`,
        alertid: 1,
        id: 5,
        type: 'GROUP',
      },
    }]))
  );
};

const raiseResourceAlert = (store, alertid = 999, id = 14, type = 'WORKFLOW') => {
  store.dispatch(
    events.message('test', JSON.stringify([{
      eventstr: 'ALERT_ONGOING_RAISED',
      time: '1990-01-01 00:00:00',
      info: {
        alert: 'TEST',
        name: 'TEST',
        alertid,
        id,
        type,
      },
    }]))
  );
};

const raiseAlertUpdate = (store) => {
  store.dispatch(
    events.message('test', JSON.stringify([{
      eventstr: 'ALERT_ONGOING_RAISED',
      time: '2000-01-01 00:00:00',
      info: {
        alert: 'TEST-ONGOING',
        name: 'TEST-ONGOING',
        alertid: 2,
        id: 5,
        type: 'GROUP',
      },
    }]))
  );
};

describe('Alerts apievents from store/api & store/api/alerts', () => {
  let store;

  beforeEach(() => {
    store = createStore(
      combineReducers({ api }),
      {
        api: {
          alerts: {
            data: [],
            sync: true,
          },
          groups: {
            data: [],
            sync: false,
          },
          orders: {
            data: [],
            sync: false,
          },
          remotes: {
            data: [],
            sync: false,
          },
          jobs: {
            data: [],
            sync: false,
          },
          workflows: {
            data: [
              {
                id: 14,
                has_alerts: false,
                alerts: [],
              },
            ],
            sync: true,
          },
          services: {
            data: [
              {
                id: 698,
                has_alerts: false,
                alerts: [],
              },
            ],
            sync: true,
          },
        },
      },
      applyMiddleware(
        thunk,
        promise,
      )
    );
  });

  describe('Alerts: ', () => {
    it('raises new ongoing alert', () => {
      store.subscribe(() => {
        const alerts = store.getState().api.alerts.data;

        expect(alerts).to.have.length(1);
        expect(alerts[0]._updated).to.eql(true);
        expect(alerts[0].alerttype).to.eql('ONGOING');
        expect(alerts[0].name).to.eql('TEST-ONGOING');
        expect(alerts[0].alertid).to.eql(1);
      });

      raiseAlert(store, 'ONGOING');
    });

    it('updates ongoing alert', () => {
      raiseAlert(store, 'ONGOING');

      store.subscribe(() => {
        const alerts = store.getState().api.alerts.data;

        expect(alerts).to.have.length(1);
        expect(alerts[0]._updated).to.eql(true);
        expect(alerts[0].alerttype).to.eql('ONGOING');
        expect(alerts[0].name).to.eql('TEST-ONGOING');
        expect(alerts[0].when).to.eql('2000-01-01 00:00:00');
        expect(alerts[0].alertid).to.eql(2);
      });

      raiseAlertUpdate(store);
    });

    it('new resource alert updates workflow alerts', () => {
      store.subscribe(() => {
        const workflows = store.getState().api.workflows.data;

        expect(workflows).to.have.length(1);
        expect(workflows[0]._updated).to.eql(true);
        expect(workflows[0].has_alerts).to.eql(true);
        expect(workflows[0].alerts).to.have.length(1);
        expect(workflows[0].alerts[0].alerttype).to.eql('ONGOING');
        expect(workflows[0].alerts[0].alertid).to.eql(999);
      });

      raiseResourceAlert(store);
    });

    it('removes alert from workflows when alert is cleared', () => {
      raiseResourceAlert(store);
      raiseResourceAlert(store, 1000);

      store.subscribe(() => {
        const workflows = store.getState().api.workflows.data;

        expect(workflows).to.have.length(1);
        expect(workflows[0]._updated).to.eql(true);
        expect(workflows[0].has_alerts).to.eql(true);
        expect(workflows[0].alerts).to.have.length(1);
      });

      store.dispatch(
        events.message('test', JSON.stringify([{
          eventstr: 'ALERT_ONGOING_CLEARED',
          info: {
            id: 14,
            type: 'WORKFLOW',
            alertid: 999,
          },
        }]))
      );
    });

    it('sets has_alerts to false when last alert is removed', () => {
      raiseResourceAlert(store);

      store.subscribe(() => {
        const workflows = store.getState().api.workflows.data;

        expect(workflows).to.have.length(1);
        expect(workflows[0]._updated).to.eql(true);
        expect(workflows[0].has_alerts).to.eql(false);
        expect(workflows[0].alerts).to.have.length(0);
      });

      store.dispatch(
        events.message('test', JSON.stringify([{
          eventstr: 'ALERT_ONGOING_CLEARED',
          info: {
            id: 14,
            type: 'WORKFLOW',
            alertid: 999,
          },
        }]))
      );
    });

    it('raises new transient alert', () => {
      store.subscribe(() => {
        const alerts = store.getState().api.alerts.data;

        expect(alerts).to.have.length(1);
        expect(alerts[0]._updated).to.eql(true);
        expect(alerts[0].alerttype).to.eql('TRANSIENT');
        expect(alerts[0].name).to.eql('TEST-TRANSIENT');
      });

      raiseAlert(store, 'TRANSIENT');
    });

    it('cleares an ongoing alert', () => {
      raiseAlert(store, 'ONGOING');

      store.subscribe(() => {
        const alerts = store.getState().api.alerts.data;

        expect(alerts).to.have.length(0);
      });

      store.dispatch(
        events.message('test', JSON.stringify([{
          eventstr: 'ALERT_ONGOING_CLEARED',
          info: {
            alertid: 1,
          },
        }]))
      );
    });

    it('removes the _updated flag', () => {
      raiseAlert(store, 'ONGOING');

      store.subscribe(() => {
        const alerts = store.getState().api.alerts.data;

        expect(alerts).to.have.length(1);
        expect(alerts[0]._updated).to.eql(null);
      });

      store.dispatch(
        actions.updateDone(1)
      );
    });
  });
});
