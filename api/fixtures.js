const usersData = require('./data').getData('users');
const rolesData = require('./data').getData('roles');
const permsData = require('./data').getData('permissions')[0];
const valuemapsData = require('./data').getData('valuemaps');
const valuesData = require('./data').getData('valuemaps/values');

export {
  usersData,
  rolesData,
  permsData,
  valuemapsData,
  valuesData,
};
