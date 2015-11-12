export function setWorkflowAutostart(actions) {
  return (id, value) => dispatch => {
    dispatch(actions.workflows.action({
      body: JSON.stringify({
        action: 'setAutostart',
        autostart: value,
        // XXX This value will update state and is ignored by Workflow
        // REST API
        exec_count: value
      })
    }, id));
  };
}
