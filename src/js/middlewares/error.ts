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
// @ts-expect-error ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
): Object => {
  const newAction = { ...action };

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
  if (action && action.error && action.payload.res) {
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { res, notificationId },
    } = action;

    if (res.status >= 500 && res.status < 600) {
      const errorMessage: string = await res.json();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type '{ const... Remove this comment to see the full error message
      newAction.payload = errorMessage;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Object... Remove this comment to see the full error message
      store.dispatch(bubbles.error(errorMessage, notificationId));
    } else if (res.status === 409) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type '{ const... Remove this comment to see the full error message
      newAction.payload = await res.json();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Object... Remove this comment to see the full error message
      store.dispatch(bubbles.error(newAction.payload.desc, notificationId));
    } else if (res.status === 400) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type '{ const... Remove this comment to see the full error message
      newAction.payload = await res.json();
    }
  }
  return next(newAction);
};
