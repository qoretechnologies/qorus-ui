import { expect } from 'chai';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import { getItem } from '../../utils';
import api from '../../../src/js/store/api';
import * as events from '../../../src/js/store/apievents/actions';
import * as actions from '../../../src/js/store/api/resources/jobs/actions';

describe('Jobs apievents from store/api & store/api/resources/jobs', () => {
  let store;

  beforeEach(() => {
    store = createStore(
      api,
      {
        jobs: {
          data: [
            {
              id: 1,
              enabled: true,
              active: true,
              results: {
                data: [],
                sync: true,
              },
            },
            {
              id: 2,
              enabled: false,
              active: false,
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

  describe('Jobs: ', () => {
    it('deactivates a job', () => {
      store.subscribe(() => {
        const job = getItem(store, 'jobs', 1);

        expect(job.active).to.eql(false);
        expect(job._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'JOB_STOP',
            info: {
              jobid: 1,
            },
          }])
        )
      );
    });

    it('activates a job', () => {
      store.subscribe(() => {
        const job = getItem(store, 'jobs', 2);

        expect(job.active).to.eql(true);
        expect(job._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'JOB_START',
            info: {
              jobid: 2,
            },
          }])
        )
      );
    });

    it('adds a new job instance and updates the results', () => {
      store.subscribe(() => {
        const job = getItem(store, 'jobs', 1);

        expect(job.results.data.length).to.eql(1);
        expect(job.results.data[0].jobstatus).to.eql('IN-PROGRESS');
        expect(job.results.data[0].started).to.eql('Now');
        expect(job.results.data[0]._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'JOB_INSTANCE_START',
            time: 'Now',
            info: {
              jobid: 1,
              job_instanceid: 1,
              name: 'TEST',
              version: '1.0',
            },
          }])
        )
      );
    });

    it('adds a new job instance and updates the job', () => {
      store.subscribe(() => {
        const job = getItem(store, 'jobs', 2);

        expect(job['IN-PROGRESS']).to.eql(1);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'JOB_INSTANCE_START',
            time: 'Now',
            info: {
              jobid: 2,
              job_instanceid: 2,
              name: 'TEST',
              version: '1.0',
            },
          }])
        )
      );
    });

    it('sets _updated to null on a result', () => {
      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'JOB_INSTANCE_START',
            time: 'Now',
            info: {
              jobid: 1,
              job_instanceid: 1,
              name: 'TEST',
              version: '1.0',
            },
          }])
        )
      );

      store.subscribe(() => {
        const job = getItem(store, 'jobs', 1);

        expect(job._updated).to.eql(null);
      });

      store.dispatch(
        actions.specials.instanceUpdateDone(1)
      );
    });

    it('disables when synthetic group is disabled', () => {
      store.subscribe(() => {
        const job = getItem(store, 'jobs', 1);

        expect(job.enabled).to.eql(false);
        expect(job._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'GROUP_STATUS_CHANGED',
            info: {
              type: 'job',
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
        const job = getItem(store, 'jobs', 2);

        expect(job.enabled).to.eql(true);
        expect(job._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'GROUP_STATUS_CHANGED',
            info: {
              type: 'job',
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
            eventstr: 'JOB_STOP',
            info: {
              jobid: 1,
            },
          }])
        )
      );

      store.subscribe(() => {
        const job = getItem(store, 'jobs', 1);

        expect(job._updated).to.eql(null);
      });

      store.dispatch(
        actions.specials.updateDone(1)
      );
    });
  });
});
