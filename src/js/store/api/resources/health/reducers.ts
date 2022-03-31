const remoteChanged = {
  next(state: Object, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };

    events.forEach((event) => {
      const remote = data.remote.find(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (rm: Object): boolean => rm.name === event.name
      );

      if (remote) {
        remote.health = event.health;
      }
    });

    return { ...state, ...{ data } };
  },
};

export { remoteChanged as REMOTECHANGED };
