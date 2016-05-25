export function setOption(actions) {
  return (option, value) => dispatch => {
    dispatch(actions.systemOptions.action({
      body: JSON.stringify({
        action: 'set',
        value,
      }),
    }, option));
  };
}
