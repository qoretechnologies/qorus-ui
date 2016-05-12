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
        workflowstatus: 'BLOCKED',
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
        workflowstatus: 'CANCELED',
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
