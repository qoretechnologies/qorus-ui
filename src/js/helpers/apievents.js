// @flow
const timeOuts: Object = {};
const intervals: Object = {};
const container: Object = {};

const eventAction: Function = (
  ev: string,
  func: Function,
  dispatch: Function,
  purgeInt: boolean
): void => {
  if (container[ev].length) {
    dispatch(func(container[ev]));
    container[ev] = [];

    if (purgeInt) {
      clearInterval(intervals[ev]);
      clearTimeout(timeOuts[ev]);
      delete intervals[ev];
    }
  }
};

const pipeline: Function = (
  ev: string,
  func: Function,
  data: Object,
  dispatch: Function
): void => {
  if (timeOuts[ev]) clearTimeout(timeOuts[ev]);
  if (!container[ev]) container[ev] = [];

  container[ev].push(data);

  if (process.env.TESTINST || global.it) {
    eventAction(ev, func, dispatch, true);
  }

  timeOuts[ev] = setTimeout(() => {
    eventAction(ev, func, dispatch, true);
  }, 200);

  if (!intervals[ev]) {
    intervals[ev] = setInterval(() => {
      eventAction(ev, func, dispatch);
    }, 2200);
  }
};

export {
  pipeline,
};
