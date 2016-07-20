/* @flow */
// import { createAction } from 'redux-actions';

// export const setUserToken = createAction('SET_USER_TOKEN');
// export const deleteUserToken = createAction('DELETE_USER_TOKEN');

// export function sendAuthCredentials(
//   login: string,
//   password: string
// ): Function {
//   return async () => new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (login === 'admin' && password === 'test') {
//         resolve({ token: 'sometkn123' });
//       }
//       reject({ error: 'some' });
//     });
//   });
// }


export function sendAuthCredentials(actions: any) {
  return (login: string, password: string) => (dispatch: Function) => (
    dispatch(actions.auth.update({
      body: JSON.stringify({ user: login, pass: password, action: 'login' }),
    }))
  );
}
