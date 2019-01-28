/* @flow */
import { bubbles } from '../store/ui/actions';

/**
 * Error middleware. If action has got error, then tries to handle it.
 * If payload has got res object and res.status == 400 then load json response.
 * If payload has got res object and res.status == 409 then load json
 * response and send bubble.
 * If payload has got res object and res.status >= 500 and < 600 then
 * send "Server error" bubble.
 * If payload hasn`t got response then do nothing.
 */
export default (store: Object) => (next: Function) => async (
  action: Object
): Object => {
  const newAction = { ...action };

  if (action && action.error && action.payload.res) {
    const {
      payload: { res, notificationId },
    } = action;

    if (res.status >= 500 && res.status < 600) {
      const errorMessage: string = await res.json();

      newAction.payload = errorMessage;
      store.dispatch(bubbles.error(errorMessage, notificationId));
    } else if (res.status === 409) {
      newAction.payload = await res.json();
      store.dispatch(bubbles.error(newAction.payload.desc, notificationId));
    } else if (res.status === 400) {
      newAction.payload = await res.json();
    }
  }
  return next(newAction);
};
