/* @flow */
import { notifications } from '../store/ui/actions';

/**
 * Error middleware. If action has got error, then tries to handle it.
 * If payload has got res object and res.status == 400 then load json response.
 * If payload has got res object and res.status == 409 then load json
 * response and send notification.
 * If payload has got res object and res.status >= 500 and < 600 then
 * send "Server error" notification.
 * If payload hasn`t got response then do nothing.
 */
export default (store: Object) => (next: Function) => async (action: Object): Object => {
  const newAction = { ...action };
  if (action.error && action.payload.res) {
    const { payload: { res } } = action;

    if (res.status >= 500 && res.status < 600) {
      newAction.payload = 'Server error';
      store.dispatch('Server error');
    } else if (res.status === 409) {
      newAction.payload = await res.json();
      store.dispatch(
        notifications.error(newAction.payload.desc)
      );
    } else if (res.status === 400) {
      newAction.payload = await res.json();
    }
  }
  return next(newAction);
};