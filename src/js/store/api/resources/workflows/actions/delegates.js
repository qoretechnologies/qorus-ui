export function setAutostart(actions) {
  return (workflow, value) => dispatch => {
    dispatch(actions.workflows.action({
      body: JSON.stringify({
        action: 'setAutostart',
        autostart: value,
        // XXX This value will update state and is ignored by Workflow
        // REST API
        exec_count: workflow.enabled ? value : 0,
      }),
    }, workflow.id));
  };
}


export function enable(actions) {
  return workflow => dispatch => {
    dispatch(actions.workflows.action({
      body: JSON.stringify({
        action: 'enable',
        // XXX This value will update state and is ignored by Workflow
        // REST API
        enabled: true,
        exec_count: workflow.autostart,
      }),
    }, workflow.id));
  };
}


export function disable(actions) {
  return workflow => dispatch => {
    dispatch(actions.workflows.action({
      body: JSON.stringify({
        action: 'disable',
        // XXX This value will update state and is ignored by Workflow
        // REST API
        enabled: false,
        exec_count: 0,
      }),
    }, workflow.id));
  };
}


export function reset(actions) {
  return workflow => dispatch => {
    dispatch(actions.workflows.action({
      body: JSON.stringify({
        action: 'reset',
      }),
    }, workflow.id));
  };
}

export function enableBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.workflows.batch_action('enable', ids.join(','), { enabled: true }));
  };
}

export function disableBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.workflows.batch_action('disable', ids.join(','), { enabled: false }));
  };
}

export function resetBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.workflows.batch_action('reset', ids.join(',')));
  };
}
