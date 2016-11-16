import { expect } from 'chai';
import { createStore, applyMiddleware } from 'redux';
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
      api,
      {
        alerts: {
          data: [],
          sync: true,
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
        const alerts = store.getState().alerts.data;

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
        const alerts = store.getState().alerts.data;

        expect(alerts).to.have.length(1);
        expect(alerts[0]._updated).to.eql(true);
        expect(alerts[0].alerttype).to.eql('ONGOING');
        expect(alerts[0].name).to.eql('TEST-ONGOING');
        expect(alerts[0].when).to.eql('2000-01-01 00:00:00');
        expect(alerts[0].alertid).to.eql(2);
      });

      raiseAlertUpdate(store);
    });

    it('raises new transient alert', () => {
      store.subscribe(() => {
        const alerts = store.getState().alerts.data;

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
        const alerts = store.getState().alerts.data;

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
        const alerts = store.getState().alerts.data;

        expect(alerts).to.have.length(1);
        expect(alerts[0]._updated).to.eql(null);
      });

      store.dispatch(
        actions.updateDone(1)
      );
    });
  });
});
