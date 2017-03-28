// @flow
const CONN_MAP: Object = {
  datasources: 'DATASOURCE',
  user: 'USER-CONNECTION',
  qorus: 'REMOTE',
};

const DELETE_PERMS_MAP: Object = {
  datasources: ['DATASOURCE-CONTROL', 'DELETE-DATASOURCE'],
  user: ['USER-CONNECTION-CONTROL', 'DELETE-USER-CONNECTION'],
  qorus: ['TBD'],
};

const ADD_PERMS_MAP: Object = {
  datasources: ['DATASOURCE-CONTROL', 'ADD-DATASOURCE'],
  user: ['USER-CONNECTION-CONTROL', 'ADD-USER-CONNECTION'],
  qorus: ['TBD'],
};

const EDIT_PERMS_MAP: Object = {
  datasources: ['DATASOURCE-CONTROL', 'MODIFY-DATASOURCE'],
  user: ['USER-CONNECTION-CONTROL', 'MODIFY-USER-CONNECTION'],
  qorus: ['TBD'],
};

export {
  CONN_MAP,
  DELETE_PERMS_MAP,
  ADD_PERMS_MAP,
  EDIT_PERMS_MAP,
};
