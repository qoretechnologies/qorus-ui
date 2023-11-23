/* @flow */

/**
 * Auth middleare. Do not store received token in state. store it in
 * window.localStorage. We can't use store.dispatch on fetchJSON so
 * we will use localStoage. if action has got token then replace it with
 * "ok" status.
 */
// @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
const auth: Function =
  () =>
  (next: Function) =>
  (action: any): any => {
    if (!action) return next(action);

    // @ts-ignore ts-migrate(2696) FIXME: The 'Object' type is assignable to very few other ... Remove this comment to see the full error message
    const { type, payload = {} }: { type: string; payload: any } = action;

    if (type === 'AUTH_UPDATE') {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'token' does not exist on type 'Object'.
      if (payload.token) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'token' does not exist on type 'Object'.
        localStorage.setItem('token', payload.token);

        const updatedAction: any = Object.assign({}, action, {
          payload: { status: 'ok' },
        });
        return next(updatedAction);
      }
    }

    return next(action);
  };

export default auth;
