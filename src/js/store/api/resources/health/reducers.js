const changed = {
  next(
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };

    events.forEach(event => {
      const remote = data.remote.find(
        (rm: Object): boolean => rm.name === event.name
      );

      if (remote) {
        remote.health = event.health;
      }
    });

    return { ...state, ...{ data } };
  },
};

export { changed as CHANGED };
