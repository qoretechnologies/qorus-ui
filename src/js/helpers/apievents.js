// @flow
const timeOuts: Object = {};
const intervals: Object = {};
const container: Object = {};

const eventAction: Function = (
  ev: string,
  func: Function,
  dispatch: Function
): void => {
  if (container[ev].length) {
    console.log(container[ev], func);
    setTimeout(() => {
      dispatch(func(container[ev]));
      container[ev] = [];

      clearInterval(intervals[ev]);
      clearTimeout(timeOuts[ev]);
      delete intervals[ev];
      delete timeOuts[ev];
    }, 100);
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

  timeOuts[ev] = setTimeout(() => {
    eventAction(ev, func, dispatch, true);
  }, 200);

  if (!intervals[ev]) {
    intervals[ev] = setInterval(() => {
      eventAction(ev, func, dispatch);
    }, 2200);
  }
};

export { pipeline };
