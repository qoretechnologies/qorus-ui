import { lockOrder, unlockOrder, addNote as addNoteFunc, skipIndexes } from './helpers';

export function reschedule(actions) {
  return (order, date) => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'schedule',
        date,
        // XXX This value will update state and is ignored by Service
        // REST API
        workflowstatus: 'SCHEDULED',
        scheduled: date,
      }),
    }, order.id));
  };
}

export function lock(actions) {
  return (order, note, username) => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'lock',
        note,
        username,
      }),
      update: lockOrder(order, note, username),
    }, order.id));
  };
}

export function unlock(actions) {
  return (order, note, username) => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'unlock',
        note,
        username,
      }),
      update: unlockOrder(order, note, username),
    }, order.id));
  };
}

export function addNote(actions) {
  return (order, note, username) => dispatch => {
    dispatch(actions.orders.update({
      body: JSON.stringify({
        action: 'notes',
        note,
        username,
      }),
      update: addNoteFunc(order, true, username, note),
    }, order.id));
  };
}

export function setPriority(actions) {
  return (order, priority) => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'setPriority',
        priority,
      }),
      update: {
        priority,
      },
    }, order.id));
  };
}
