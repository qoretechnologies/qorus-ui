/* @flow */

/**
 * Auth middleare. Do not store received token in state. store it in
 * window.localStorage. We can't use store.dispatch on fetchJSON so
 * we will use localStoage. if action has got token then replace it with
 * "ok" status.
 */
const auth = () => (next: Function) => (action: any) => {
  const { type, payload = {} } = action;

  if (type === 'AUTH_UPDATE') {
    if (payload.token) {
      localStorage.setItem('token', payload.token);
      const updatedAction = Object.assign(
        {},
        action,
        { payload: { status: 'ok' } }
      );
      return next(updatedAction);
    }
  }

  return next(action);
};


export default auth;
