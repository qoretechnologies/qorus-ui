export function enable(actions) {
  return group => dispatch => {
    dispatch(actions.groups.action({
      body: JSON.stringify({
        action: 'enable',
        enabled: true,
      }),
    }, group.name));
  };
}

export function disable(actions) {
  return group => dispatch => {
    dispatch(actions.groups.action({
      body: JSON.stringify({
        action: 'disable',
        enabled: false,
      }),
    }, group.name));
  };
}

export function enableBatch(actions) {
  return names => dispatch => {
    dispatch(
      actions.groups.batch_action(
        'setStatus',
        names.join(','),
        'enabled=true',
        { enabled: true },
        'groups'
      )
    );
  };
}

export function disableBatch(actions) {
  return names => dispatch => {
    dispatch(
      actions.groups.batch_action(
        'setStatus',
        names.join(','),
        'enabled=false',
        { enabled: false },
        'groups'
      )
    );
  };
}
