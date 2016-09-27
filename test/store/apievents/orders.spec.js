import { expect } from 'chai';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import { getItem } from '../../utils';
import api from '../../../src/js/store/api';
import * as events from '../../../src/js/store/apievents/actions';
import { updateDone } from '../../../src/js/store/api/resources/orders/actions/specials';

describe('Orders apievents from store/apievents & store/api/resources/orders', () => {
  describe('Orders: ', () => {
    it('adds a new note', () => {
      const store = createStore(
        api,
        {
          orders: {
            data: [
              {
                id: 1,
                note_count: 0,
                notes: [],
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

      store.subscribe(() => {
        const order = getItem(store, 'orders', 1);

        expect(order.note_count).to.eql(1);
        expect(order.notes[0].saved).to.eql(true);
        expect(order.notes[0].username).to.eql('admin');
        expect(order.notes[0].note).to.eql('This is a test note');
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'WORKFLOW_INFO_CHANGED',
            info: {
              workflow_instanceid: 1,
              info: {
                saved: true,
                username: 'admin',
                note: 'This is a test note',
              },
            },
          }])
        )
      );
    });

    it('adds a new order', (done) => {
      const checkMiddleware = str => next => action => {
        const result = next(action);
        const orders = str.getState().orders.data;

        if (action.type === 'ORDERS_ADDORDER') {
          expect(orders).to.have.length(1);
          expect(orders[0].normalizedName).to.eql('TEST WORKFLOW v1.0 (123)');
          expect(orders[0].workflowstatus).to.eql('RETRY');
          expect(orders[0].started).to.eql('Now');
          expect(orders[0]._updated).to.eql(true);


          done();
        }

        return result;
      };

      const store = createStore(
        api,
        {
          orders: {
            data: [],
            sync: true,
          },
        },
        applyMiddleware(
          thunk,
          promise,
          checkMiddleware
        )
      );


      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'WORKFLOW_DATA_SUBMITTED',
            time: 'Now',
            info: {
              workflowid: 3,
              workflow_instanceid: 123,
              name: 'TEST WORKFLOW',
              status: 'RETRY',
              version: '1.0',
            },
          }])
        )
      );
    });

    it('modifies an order', (done) => {
      const checkMiddleware = str => next => action => {
        const result = next(action);
        const orders = str.getState().orders.data;

        if (action.type === 'ORDERS_MODIFYORDER') {
          expect(orders).to.have.length(1);
          expect(orders[0].workflowstatus).to.eql('ERROR');
          expect(orders[0].modified).to.eql('Then');
          expect(orders[0]._updated).to.eql(true);

          done();
        }

        return result;
      };

      const store = createStore(
        api,
        {
          orders: {
            data: [],
            sync: true,
          },
        },
        applyMiddleware(
          thunk,
          promise,
          checkMiddleware
        )
      );

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'WORKFLOW_DATA_SUBMITTED',
            time: 'Now',
            info: {
              workflowid: 3,
              workflow_instanceid: 123,
              name: 'TEST WORKFLOW',
              status: 'RETRY',
              version: '1.0',
            },
          }])
        )
      );

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'WORKFLOW_STATUS_CHANGED',
            time: 'Then',
            info: {
              info: {
                old: 'RETRY',
                new: 'ERROR',
              },
              workflow_instanceid: 123,
            },
          }])
        )
      );
    });

    it('sets _updated to null', () => {
      const store = createStore(
        api,
        {
          orders: {
            data: [{
              id: 123,
              _updated: true,
            }],
            sync: true,
          },
        },
        applyMiddleware(
          thunk,
          promise,
        )
      );

      store.subscribe(() => {
        const order = getItem(store, 'orders', 123);

        expect(order._updated).to.eql(null);
      });

      store.dispatch(
        updateDone(123)
      );
    });
  });
});
