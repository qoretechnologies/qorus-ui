export function enable(actions) {
  return service => dispatch => {
    dispatch(actions.services.action({
      body: JSON.stringify({
        action: 'enable',
        // XXX This value will update state and is ignored by Service
        // REST API
        enabled: true,
      }),
    }, service.id));
  };
}

export function disable(actions) {
  return service => dispatch => {
    dispatch(actions.services.action({
      body: JSON.stringify({
        action: 'disable',
        // XXX This value will update state and is ignored by Service
        // REST API
        enabled: false,
      }),
    }, service.id));
  };
}

export function reset(actions) {
  return service => dispatch => {
    dispatch(actions.services.action({
      body: JSON.stringify({
        action: 'reset',
      }),
    }, service.id));
  };
}

export function load(actions) {
  return service => dispatch => {
    dispatch(actions.services.action({
      body: JSON.stringify({
        action: 'load',
        status: 'loaded',
      }),
    }, service.id));
  };
}

export function unload(actions) {
  return service => dispatch => {
    dispatch(actions.services.action({
      body: JSON.stringify({
        action: 'unload',
        status: 'unloaded',
      }),
    }, service.id));
  };
}

export function autostartOn(actions) {
  return (service) => dispatch => {
    dispatch(actions.services.action({
      body: JSON.stringify({
        action: 'setAutostart',
        autostart: true,
      }),
    }, service.id));
  };
}

export function autostartOff(actions) {
  return (service) => dispatch => {
    dispatch(actions.services.action({
      body: JSON.stringify({
        action: 'setAutostart',
        autostart: false,
      }),
    }, service.id));
  };
}

export function enableBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.services.batch_action('enable', ids.join(','), null, { enabled: true }));
  };
}

export function disableBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.services.batch_action('disable', ids.join(','), null, { enabled: false }));
  };
}

export function loadBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.services.batch_action('load', ids.join(','), null, { status: 'loaded' }));
  };
}

export function unloadBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.services.batch_action('unload', ids.join(','), null, { status: 'unloaded' }));
  };
}

export function resetBatch(actions) {
  return ids => dispatch => {
    dispatch(actions.services.batch_action('reset', ids.join(',')));
  };
}
