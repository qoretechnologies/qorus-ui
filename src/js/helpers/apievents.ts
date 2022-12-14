// @flow
const timeOuts: any = {};
const intervals: any = {};
const container: any = {};

const eventAction: Function = (ev: string, func: Function, dispatch: Function): void => {
  if (container[ev].length) {
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

const pipeline: Function = (ev: string, func: Function, data: any, dispatch: Function): void => {
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
