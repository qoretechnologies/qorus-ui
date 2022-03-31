const changeQuery = (router: any, location: any, change: any, merge: boolean = true) => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'pathname' does not exist on type 'Object... Remove this comment to see the full error message
  const { pathname, query } = location;
  let newQuery = merge ? Object.assign(query, change) : change;

  // @ts-ignore ts-migrate(2339) FIXME: Property 'tab' does not exist on type 'Object'.
  if (!merge && query.tab && !change.tab) {
    newQuery = { ...newQuery, ...{ tab: query.tab } };
  }

  // @ts-ignore ts-migrate(2339) FIXME: Property 'push' does not exist on type 'Object'.
  router.push({
    pathname,
    query: newQuery,
  });
};

const buildPageLinkWithQueries: Function =
  (queryIdentifier: string, tabId: string): Function =>
  (location: any): any => {
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
        // @ts-ignore ts-migrate(2339) FIXME: Property 'query' does not exist on type 'Object'.
        ...location.query,
        [queryIdentifier]: tabId.toLowerCase(),
      },
    };
  };

const isActive = (to, location) => location.startsWith(to);
const isActiveMulti: Function = (to: Array<string>, location: any) => {
  let active: boolean = false;

  to.forEach((path: string) => {
    if (isActive(path, location)) {
      active = true;
    }
  });

  return active;
};

export { isActive, changeQuery, buildPageLinkWithQueries, isActiveMulti };
