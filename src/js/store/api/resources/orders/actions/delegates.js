import { lockOrder, unlockOrder, addNote as addNoteFunc } from './helpers';

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
