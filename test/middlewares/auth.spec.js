import chai, { expect } from 'chai';
import spies from 'chai-spies';
import auth from '../../src/js/middlewares/auth';

describe('{ auth } from middlewares/auth', () => {
  before(() => {
    chai.use(spies);
  });

  after(() => {
    window.localStorage.deleteItem('token');
  });

  it('not AUTH_UPDATE action', () => {
    const action = {
      type: 'SOME_ACTION',
      payload: { test: 'test' },
    };
    const next = chai.spy();
    const state = {};

    auth(state)(next)(action);

    expect(next).to.have.been.called.with(action);
  });

  it('AUTH_UPDATE action with error', () => {
    const action = {
      type: 'AUTH_UPDATE',
      payload: { error: 'error' },
    };
    const next = chai.spy();
    const state = {};

    auth(state)(next)(action);

    expect(next).to.have.been.called.with(action);
  });

  it('AUTH_UPDATE action with token', () => {
    const action = {
      type: 'AUTH_UPDATE',
      payload: { token: 'tkn123' },
    };
    const expectedAction = {
      type: 'AUTH_UPDATE',
      payload: { status: 'ok' },
    };
    const next = chai.spy();
    const state = {};

    auth(state)(next)(action);

    expect(next).to.have.been.called.with(expectedAction);

    const token = window.localStorage.getItem('token');
    expect(token).to.equal('tkn123');
  });
});
