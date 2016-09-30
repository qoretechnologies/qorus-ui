import { lockOrder, unlockOrder, addNote as addNoteFunc, skipIndexes } from './helpers';

export function retry(actions) {
  return order => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'retry',
        // XXX This value will update state and is ignored by Service
        // REST API
        workflowstatus: 'RETRYING',
      }),
    }, order.id));
  };
}

export function block(actions) {
  return order => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'block',
        // XXX This value will update state and is ignored by Service
        // REST API
        workflowstatus: 'BLOCKING',
      }),
    }, order.id));
  };
}

export function unblock(actions) {
  return order => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'unblock',
        // XXX This value will update state and is ignored by Service
        // REST API
        workflowstatus: 'UNBLOCKING',
      }),
    }, order.id));
  };
}

export function cancel(actions) {
  return order => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'cancel',
        // XXX This value will update state and is ignored by Service
        // REST API
        workflowstatus: 'CANCELING',
      }),
    }, order.id));
  };
}

export function uncancel(actions) {
  return order => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'uncancel',
        // XXX This value will update state and is ignored by Service
        // REST API
        workflowstatus: 'UNCANCELING',
      }),
    }, order.id));
  };
}

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

export function skipStep(actions) {
  return (order, stepid, value) => dispatch => {
    dispatch(actions.orders.action({
      body: JSON.stringify({
        action: 'skipStep',
        stepid,
        ind: value,
        noretry: true,
      }),
      update: {
        StepInstances: skipIndexes(order, stepid, value),
      },
    }, order.id));
  };
}

export function retryBatch(actions) {
  return ids => dispatch => {
    dispatch(
      actions.orders.batch_action('retry', ids.join(','), null, { workflowstatus: 'RETRYING' })
    );
  };
}

export function cancelBatch(actions) {
  return ids => dispatch => {
    dispatch(
      actions.orders.batch_action('cancel', ids.join(','), null, { workflowstatus: 'CANCELING' })
    );
  };
}

export function uncancelBatch(actions) {
  return ids => dispatch => {
    dispatch(
      actions.orders.batch_action(
        'uncancel', ids.join(','), null, { workflowstatus: 'UNCANCELING' }
      )
    );
  };
}

export function blockBatch(actions) {
  return ids => dispatch => {
    dispatch(
      actions.orders.batch_action('block', ids.join(','), null, { workflowstatus: 'BLOCKING' })
    );
  };
}

export function unblockBatch(actions) {
  return ids => dispatch => {
    dispatch(
      actions.orders.batch_action('unblock', ids.join(','), null, { workflowstatus: 'UNBLOCKING' })
    );
  };
}
