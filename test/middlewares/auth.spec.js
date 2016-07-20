/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import sinon from 'sinon';

import auth from '../../src/js/middlewares/auth';

describe('{ auth } from middlewares/auth', () => {
  it('not AUTH_UPDATE action', () => {
    const action = {
      type: 'SOME_ACTION',
      payload: { test: 'test' },
    };
    const next = sinon.spy();
    const state = {};

    auth(state)(next)(action);

    expect(next.calledWith(action)).to.be.true;
  });

  it('AUTH_UPDATE action with error', () => {
    const action = {
      type: 'AUTH_UPDATE',
      payload: { error: 'error' },
    };
    const next = sinon.spy();
    const state = {};

    auth(state)(next)(action);

    expect(next.calledWith(action)).to.be.true;
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
    const next = sinon.spy();
    const state = {};

    auth(state)(next)(action);

    expect(next.calledWith(expectedAction)).to.be.true;

    const token = window.localStorage.getItem('token');
    expect(token).to.equal('tkn123');
  });
});
