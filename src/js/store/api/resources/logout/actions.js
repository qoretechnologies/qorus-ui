/* @flow */

export function logout(actions: any): Function {
  return () => (dispatch: Function) => (
    dispatch(actions.logout.update({
      body: JSON.stringify({}),
    }))
  );
}
