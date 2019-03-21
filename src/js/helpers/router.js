const changeQuery = (
  router: Object,
  location: Object,
  change: Object,
  merge: boolean = true
) => {
  const { pathname, query } = location;
  let newQuery = merge ? Object.assign(query, change) : change;

  if (!merge && query.tab && !change.tab) {
    newQuery = { ...newQuery, ...{ tab: query.tab } };
  }

  router.push({
    pathname,
    query: newQuery,
  });
};

const buildPageLinkWithQueries: Function = (
  queryIdentifier: string,
  tabId: string
): Function => (location: Object): Object => {
  if (queryIdentifier === 'tab') {
    return {
      ...location,
      query: {
        tab: tabId.toLowerCase(),
      },
    };
  }

  return {
    ...location,
    query: {
      ...location.query,
      [queryIdentifier]: tabId.toLowerCase(),
    },
  };
};

const isActive = (to, location) => location.startsWith(to);
const isActiveMulti: Function = (to: Array<string>, location: Object) => {
  let active: boolean = false;

  to.forEach((path: string) => {
    if (isActive(path, location)) {
      active = true;
    }
  });

  return active;
};

export { isActive, changeQuery, buildPageLinkWithQueries, isActiveMulti };
