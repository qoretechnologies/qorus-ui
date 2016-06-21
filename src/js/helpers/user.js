import { includes } from 'lodash';

const hasPermission = (userPerms, permissions) => {
  const perms = typeof permissions === 'string' ? [permissions] : permissions;

  return perms.every(p => includes(userPerms, p));
};

export {
  hasPermission,
};
