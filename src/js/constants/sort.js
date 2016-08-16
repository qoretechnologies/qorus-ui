import keyMirror from 'keymirror';

export default keyMirror({
  CHANGE_SORT: null,
  INIT_SORT: null,
});


export const sortDefaults = {
  orders: {
    sortBy: 'started',
    sortByKey: { direction: -1, ignoreCase: true },
    historySortBy: 'workflowstatus',
    historySortyByKey: { direction: 1, ignoreCase: true },
  },
  alerts: {
    sortBy: 'type',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'alert',
    historySortByKey: { ignoreCase: true, direction: -1 },
  },
  errors: {
    sortBy: 'error',
    sortByKey: { direction: -1, ignoreCase: true },
    historySortBy: 'description',
    historySortByKey: { direction: 1, ignoreCase: true },
  },
  groups: {
    sortBy: 'enabled',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'name',
    historySortByKey: { ignoreCase: true, direction: 1 },
  },
  jobs: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'version',
    historySortByKey: { ignoreCase: true, direction: -1 },
  },
  options: {
    sortBy: 'status',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'name',
    historySortByKey: { ignoreCase: true, direction: 1 },
  },
  services: {
    sortBy: 'type',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'name',
    historySortByKey: { ignoreCase: true, direction: 1 },
  },
  workflows: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'version',
    historySortByKey: { ignoreCase: true, direction: -1 },
  },
};
