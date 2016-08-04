import chai, { expect } from 'chai';
import spies from 'chai-spies';

import error from '../../src/js/middlewares/error';

chai.use(spies);

describe.only('{ error } from middleware/error', () => {
  let result;
  const next = data => {
    result = data;
  };
  let store;

  beforeEach(() => {
    result = undefined;
    store = {
      dispatch: chai.spy(),
    };
  });

  it('action without error', () => {
    const action = {
      type: 'SOME_ACTION',
      payload: 'test',
    };

    error(store)(next)(action);

    expect(store.dispatch).to.not.have.been.called();
  });

  it('action error no response', () => {
    const action = {
      type: 'SOME_ACTION',
      error: true,
      payload: 'test',
    };

    error(store)(next)(action);

    expect(store.dispatch).to.not.have.been.called();
  });

  it('action error with 400 response', async () => {
    const action = {
      type: 'SOME_ACTION',
      error: true,
      payload: {
        res: {
          status: 400,
          json: () => new Promise(resolve => resolve({ data: 'test' })),
        },
      },
    };

    await error(store)(next)(action);

    expect(store.dispatch).to.not.have.been.called();
    expect(result.type).to.equals('SOME_ACTION');
    expect(result.error).to.be.true;
    expect(result.payload.data).to.equals('test');
  });

  it('action error with 409 response', async () => {
    const action = {
      type: 'SOME_ACTION',
      error: true,
      payload: {
        res: {
          status: 409,
          json: () => new Promise(resolve => resolve({ desc: 'error' })),
        },
      },
    };

    await error(store)(next)(action);
    expect(store.dispatch).to.have.been.called();
    expect(result.type).to.equals('SOME_ACTION');
    expect(result.error).to.be.true;
    expect(result.payload.desc).to.equals('error');
  });

  it('action error with 500 response', async () => {
    const action = {
      type: 'SOME_ACTION',
      error: true,
      payload: {
        res: {
          status: 500,
        },
      },
    };

    await error(store)(next)(action);

    expect(store.dispatch).to.have.been.called();
    expect(result.type).to.equals('SOME_ACTION');
    expect(result.error).to.be.true;
    expect(result.payload).to.equals('Server error');
  });
});