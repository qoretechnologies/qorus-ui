export function setAutostart(actions) {
  return (workflow, value) => dispatch => {
    dispatch(actions.workflows.action({
      body: JSON.stringify({
        action: 'setAutostart',
        autostart: value,
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
    dispatch(actions.workflows.batch_action('enable', ids.join(','), null, { enabled: true }));
  };
}

export function startBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.workflows.batch_action('start', ids.join(',')));
  };
}

export function stopBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.workflows.batch_action('stop', ids.join(',')));
  };
}

export function disableBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.workflows.batch_action('disable', ids.join(','), null, { enabled: false }));
  };
}

export function resetBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.workflows.batch_action('reset', ids.join(',')));
  };
}

export function setDeprecatedBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.workflows.batch_action(
      'setDeprecated',
      ids.join(','),
      'deprecated=true',
      { deprecated: true })
    );
  };
}

export function unsetDeprecatedBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.workflows.batch_action(
      'setDeprecated',
      ids.join(','),
      'deprecated=false',
      { deprecated: false })
    );
  };
}
