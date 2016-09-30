import { expect } from 'chai';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import { getItem } from '../../utils';
import api from '../../../src/js/store/api';
import * as events from '../../../src/js/store/apievents/actions';
import { updateDone } from '../../../src/js/store/api/resources/services/actions/specials';

describe('Services apievents from store/api & store/api/resources/services', () => {
  let store;

  beforeEach(() => {
    store = createStore(
      api,
      {
        services: {
          data: [
            {
              id: 1,
              status: 'loaded',
              enabled: true,
            },
            {
              id: 2,
              status: 'unloaded',
              enabled: false,
            },
          ],
          sync: true,
        },
      },
      applyMiddleware(
        thunk,
        promise,
      )
    );
  });

  describe('Services: ', () => {
    it('stops the service', () => {
      store.subscribe(() => {
        const service = getItem(store, 'services', 1);

        expect(service.status).to.eql('unloaded');
        expect(service._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'SERVICE_STOP',
            info: {
              serviceid: 1,
            },
          }])
        )
      );
    });

    it('starts the service', () => {
      store.subscribe(() => {
        const service = getItem(store, 'services', 2);

        expect(service.status).to.eql('loaded');
        expect(service._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'SERVICE_START',
            info: {
              serviceid: 2,
            },
          }])
        )
      );
    });

    it('disables when synthetic group is disabled', () => {
      store.subscribe(() => {
        const service = getItem(store, 'services', 1);

        expect(service.enabled).to.eql(false);
        expect(service._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'GROUP_STATUS_CHANGED',
            info: {
              type: 'service',
              synthetic: true,
              id: 1,
              enabled: false,
            },
          }])
        )
      );
    });

    it('enables when synthetic group is disabled', () => {
      store.subscribe(() => {
        const service = getItem(store, 'services', 2);

        expect(service.enabled).to.eql(true);
        expect(service._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'GROUP_STATUS_CHANGED',
            info: {
              type: 'service',
              synthetic: true,
              id: 2,
              enabled: true,
            },
          }])
        )
      );
    });

    it('sets _updated to null', () => {
      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'SERVICE_START',
            info: {
              serviceid: 2,
            },
          }])
        )
      );

      store.subscribe(() => {
        const service = getItem(store, 'services', 2);

        expect(service.status).to.eql('loaded');
        expect(service._updated).to.eql(null);
      });

      store.dispatch(
        updateDone(2)
      );
    });
  });
});
