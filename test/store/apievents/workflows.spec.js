import { expect } from 'chai';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import { getItem } from '../../utils';
import api from '../../../src/js/store/api';
import * as events from '../../../src/js/store/apievents/actions';
import * as actions from '../../../src/js/store/api/resources/workflows/actions';

describe('Workflows apievents from store/api & store/api/resources/workflows', () => {
  let store;

  beforeEach(() => {
    store = createStore(
      combineReducers({ api }),
      {
        api: {
          workflows: {
            data: [
              {
                id: 1,
                exec_count: 0,
                enabled: true,
              },
              {
                id: 2,
                exec_count: 1,
                READY: 0,
                enabled: false,
              },
              {
                id: 3,
                exec_count: 2,
                READY: 1,
                ERROR: 0,
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

  describe('Workflows: ', () => {
    it('adds one to exec_count of a workflow', () => {
      store.subscribe(() => {
        const workflow = getItem(store, 'workflows', 2);

        expect(workflow.exec_count).to.eql(2);
        expect(workflow._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'WORKFLOW_START',
            info: {
              workflowid: 2,
            },
          }])
        )
      );
    });

    it('substracts one from exec_count of a workflow', () => {
      store.subscribe(() => {
        const workflow = getItem(store, 'workflows', 3);

        expect(workflow.exec_count).to.eql(1);
        expect(workflow._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'WORKFLOW_STOP',
            info: {
              workflowid: 3,
            },
          }])
        )
      );
    });

    it('doesnt let exec_count go below zero', () => {
      store.subscribe(() => {
        const workflow = getItem(store, 'workflows', 1);

        expect(workflow.exec_count).to.eql(0);
        expect(workflow._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'WORKFLOW_STOP',
            info: {
              workflowid: 1,
            },
          }])
        )
      );
    });

    it('adds a new workflow instance and updates the workflow', () => {
      store.subscribe(() => {
        const workflow = getItem(store, 'workflows', 2);

        expect(workflow.READY).to.eql(1);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'WORKFLOW_DATA_SUBMITTED',
            info: {
              workflowid: 2,
              status: 'READY',
            },
          }])
        )
      );
    });

    it('modifies a workflow instance and updates the workflow', () => {
      store.subscribe(() => {
        const workflow = getItem(store, 'workflows', 3);

        expect(workflow.READY).to.eql(0);
        expect(workflow.ERROR).to.eql(1);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'WORKFLOW_STATUS_CHANGED',
            info: {
              workflowid: 3,
              info: {
                old: 'READY',
                new: 'ERROR',
              },
            },
          }])
        )
      );
    });

    it('disables when synthetic group is disabled', () => {
      store.subscribe(() => {
        const workflow = getItem(store, 'workflows', 1);

        expect(workflow.enabled).to.eql(false);
        expect(workflow._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'GROUP_STATUS_CHANGED',
            info: {
              type: 'workflow',
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
        const workflow = getItem(store, 'workflows', 2);

        expect(workflow.enabled).to.eql(true);
        expect(workflow._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'GROUP_STATUS_CHANGED',
            info: {
              type: 'workflow',
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
            eventstr: 'WORKFLOW_START',
            info: {
              workflowid: 2,
            },
          }])
        )
      );

      store.subscribe(() => {
        const workflow = getItem(store, 'workflows', 2);

        expect(workflow.exec_count).to.eql(2);
        expect(workflow._updated).to.eql(null);
      });

      store.dispatch(
        actions.specials.updateDone(2)
      );
    });
  });
});
