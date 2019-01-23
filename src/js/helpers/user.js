import { includes } from 'lodash';

const hasPermission = (userPerms, permissions, cond = 'and') => {
  const perms = typeof permissions === 'string' ? [permissions] : permissions;

  return cond === 'and'
    ? perms.every(p => includes(userPerms, p))
    : perms.some(p => includes(userPerms, p));
};

export { hasPermission };
