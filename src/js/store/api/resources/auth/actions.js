/* @flow */

export function sendAuthCredentials(actions: any): Function {
  return (login: string, password: string) => (dispatch: Function) => (
    dispatch(actions.auth.update({
      body: JSON.stringify({ user: login, pass: password, action: 'login' }),
    }))
  );
}
