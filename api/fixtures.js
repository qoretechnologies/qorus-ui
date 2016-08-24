const usersData = require('./data').getData('users');
const rolesData = require('./data').getData('roles');
const permsData = require('./data').getData('permissions')[0];

export {
  usersData,
  rolesData,
  permsData,
};
