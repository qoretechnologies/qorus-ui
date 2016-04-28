export function activate(actions) {
  return job => dispatch => {
    dispatch(actions.jobs.action({
      body: JSON.stringify({
        action: 'setActive',
        active: true,
      }),
    }, job.id));
  };
}

export function deactivate(actions) {
  return job => dispatch => {
    dispatch(actions.jobs.action({
      body: JSON.stringify({
        action: 'setActive',
        active: false,
      }),
    }, job.id));
  };
}

export function reset(actions) {
  return job => dispatch => {
    dispatch(actions.jobs.action({
      body: JSON.stringify({
        action: 'reset',
      }),
    }, job.id));
  };
}

export function run(actions) {
  return job => dispatch => {
    dispatch(actions.jobs.action({
      body: JSON.stringify({
        action: 'run',
      }),
    }, job.id));
  };
}

export function setExpiration(actions, date) {
  return job => dispatch => {
    dispatch(actions.jobs.action({
      body: JSON.stringify({
        action: 'setExpiry',
        date,
      }),
    }, job.id));
  };
}


export function reschedule(actions, schedule) {
  return job => dispatch => {
    dispatch(actions.jobs.action({
      body: JSON.stringify({
        action: 'schedule',
        schedule,
      }),
    }, job.id));
  };
}
