import { includes } from 'lodash';

const hasPermission = (userPerms, permissions, cond = 'and') => {
  const perms = typeof permissions === 'string' ? [permissions] : permissions;

  return cond === 'and' ?
    perms.every(p => includes(userPerms, p)) :
    perms.some(p => includes(userPerms, p));
};

// @TODO: Rewrite as only async/await?
const auth: Function = (username: string, password: string, action: Function): Promise<*> => (
  new Promise(async (resolve, reject) => {
    try {
      const result = await action(username, password);
      if (result.payload.err) {
        reject({ _error: result.payload.desc });
      } else {
        resolve(result);
      }
    } catch (e) {
      reject({ _error: 'An unexpected error' });
    }
  })
);

export {
  hasPermission,
  auth,
};
